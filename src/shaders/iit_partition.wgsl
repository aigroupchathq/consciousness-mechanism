// ============================================================================
// THE UNEXPLORED INTERIOR // WEBGPU PARALLEL TENSOR COMPUTE KERNEL
// Integrated Information Theory (Tononi & Albantakis IIT 4.0)
// Earth Mover's Distance (Wasserstein-1) over Hamming State Geometry
// ============================================================================

struct SystemUniforms {
    node_count: u32,          // N = 8
    num_bipartitions: u32,    // 127 unique non-trivial bipartitions
    active_state_mask: u32,   // Current binary state x* in [0, 255]
    coupling_strength: f32,   // Global neuromorphic coupling scalar
};

// Uniform parameters
@group(0) @binding(0) var<uniform> uniforms: SystemUniforms;

// Weight matrix W (8x8 = 64 floats)
@group(0) @binding(1) var<storage, read> weights: array<f32>;

// Node thresholds theta (8 floats)
@group(0) @binding(2) var<storage, read> thresholds: array<f32>;

// Output buffer: Array of 127 computed divergences D(M)
@group(0) @binding(3) var<storage, read_write> partition_divergences: array<f32>;

// Reduced result buffer: [0] = min_phi, [1] = argmin_mip_mask
@group(0) @binding(4) var<storage, read_write> reduction_result: array<f32, 2>;

// Sigmoid activation function
fn sigmoid(z: f32) -> f32 {
    return 1.0 / (1.0 + exp(-z));
}

// Compute unpartitioned probability P(X_i(t+1) = 1 | x*(t))
fn compute_unpartitioned_prob(i: u32, state: u32) -> f32 {
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < 8u; j = j + 1u) {
        let bit_j: f32 = f32((state >> j) & 1u);
        sum = sum + weights[i * 8u + j] * bit_j;
    }
    return sigmoid(sum * uniforms.coupling_strength - thresholds[i]);
}

// Compute partitioned probability P_M(X_i(t+1) = 1 | x*(t)) under cut mask M
// M is an 8-bit integer where bit_k = 1 if node k is in part A, and 0 if in part B.
fn compute_partitioned_prob(i: u32, state: u32, mask: u32) -> f32 {
    let part_i: u32 = (mask >> i) & 1u;
    var sum: f32 = 0.0;
    for (var j: u32 = 0u; j < 8u; j = j + 1u) {
        let part_j: u32 = (mask >> j) & 1u;
        // Sever cross-partition causal connections
        if (part_i == part_j) {
            let bit_j: f32 = f32((state >> j) & 1u);
            sum = sum + weights[i * 8u + j] * bit_j;
        }
    }
    return sigmoid(sum * uniforms.coupling_strength - thresholds[i]);
}

// Parallel workgroup: Each thread computes the divergence for one candidate bipartition M
// There are 127 unique non-trivial bipartitions for N = 8 where node 0 is fixed in part A
// (mask bit 0 = 1, mask in [1, 254]).
@compute @workgroup_size(128)
fn main_compute_divergences(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let index: u32 = global_id.x;
    if (index >= 127u) {
        return;
    }

    // Generate canonical bipartition mask:
    // Bit 0 is always 1 (node 0 in part A).
    // Remaining 7 bits take values from 0 to 126 (so mask goes from 1 to 253, avoiding 255 which is all nodes in A).
    let mask: u32 = (index << 1u) | 1u;

    var total_divergence: f32 = 0.0;
    let state: u32 = uniforms.active_state_mask;

    // Tononi IIT 4.0: Earth Mover's Distance (Wasserstein-1) over Hamming state geometry
    // For conditionally independent binary mechanisms, W1 collapses to the sum of marginal absolute deviations.
    for (var i: u32 = 0u; i < 8u; i = i + 1u) {
        let p_i: f32 = compute_unpartitioned_prob(i, state);
        let q_i: f32 = compute_partitioned_prob(i, state, mask);
        total_divergence = total_divergence + abs(p_i - q_i);
    }

    partition_divergences[index] = total_divergence;
}

// Parallel reduction workgroup to find the Minimum Information Partition (MIP)
var<workgroup> s_phi: array<f32, 128>;
var<workgroup> s_mask: array<u32, 128>;

@compute @workgroup_size(128)
fn main_find_minimum(
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let tid: u32 = local_id.x;
    
    // Load into workgroup shared memory
    if (tid < 127u) {
        s_phi[tid] = partition_divergences[tid];
        s_mask[tid] = (tid << 1u) | 1u;
    } else {
        s_phi[tid] = 1e9; // Infinity sentinel
        s_mask[tid] = 0u;
    }
    workgroupBarrier();

    // Tree-based parallel reduction in shared memory
    for (var s: u32 = 64u; s > 0u; s = s >> 1u) {
        if (tid < s) {
            if (s_phi[tid + s] < s_phi[tid]) {
                s_phi[tid] = s_phi[tid + s];
                s_mask[tid] = s_mask[tid + s];
            }
        }
        workgroupBarrier();
    }

    // Thread 0 writes final MIP output
    if (tid == 0u) {
        reduction_result[0] = s_phi[0];         // Minimum Phi value
        reduction_result[1] = f32(s_mask[0]);    // Argmin MIP bitmask
    }
}
