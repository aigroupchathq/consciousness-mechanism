export const CONSCIOUSNESS_DATA = {
  header: {
    title: "ARCHIVE : THE MECHANISM OF CONSCIOUSNESS",
    subtitle: "A digital compendium of cognitive architectures, neurobiological correlates, and philosophical models of subjective experience.",
    curators: "Cognitive Neuroscience & Neurophilosophy Research Archive",
    version: "v4.8.2 // COGNITIVE REPOSITORY",
    coordinates: "48.8566° N, 2.3522° E | LATENCY: 3.2ms"
  },
  
  heroPillars: [
    { label: "PRIMARY PARADIGMS", value: "6 FRAMEWORKS" },
    { label: "COMPUTATIONAL METRIC", value: "Φ (PHI) INTEGRATION" },
    { label: "IGNITION LATENCY", value: "270 - 320 MS" },
    { label: "PHENOMENAL QUALIA", value: "FIRST-PERSON SUBSTRATE" }
  ],

  leadArticle: {
    title: "The Architecture of Sentience",
    lead: "How does 1.4 kilograms of wet biological tissue give rise to the vivid, seamless sensation of the redness of a rose, the ache of nostalgia, or the inner voice of reflection?",
    paragraphs: [
      {
        text: "The search for the consciousness mechanism stands at the convergence of empirical neurobiology, information theory, and philosophy of mind. Historically partitioned into the Easy Problems (mapping behavioral functions, attention mechanisms, sensory discrimination) and the Hard Problem (why physical brain processing is accompanied by subjective phenomenal experience at all), modern cognitive science has shifted toward precise mechanistic models.",
        highlightTokens: ["Hard Problem", "Easy Problems", "phenomenal experience"]
      },
      {
        text: "In the 1990s, Francis Crick and Christof Koch formalized the search for the Neural Correlates of Consciousness (NCC) — the minimal neuronal mechanisms jointly sufficient for any one specific conscious percept. Rather than searching for a single 'seat of the soul', contemporary paradigms identify consciousness as an emergent systemic property governed by wide-scale synchrony, recurrence, prediction error minimization, and irreducible causal density.",
        highlightTokens: ["Neural Correlates of Consciousness (NCC)", "Francis Crick", "recurrent processing"]
      },
      {
        text: "Whether through the violent global ignition of frontoparietal networks (Global Workspace), the dense topological cause-effect complexes of Integrated Information Theory, or the relentless top-down predictive simulations of Bayesian active inference, the mechanism of consciousness is increasingly treated not as magic, but as the brain's ultimate survival algorithm.",
        highlightTokens: ["Global Workspace", "Integrated Information Theory", "Bayesian active inference"]
      }
    ]
  },

  theories: [
    {
      id: "gnwt",
      acronym: "GNWT",
      name: "Global Neuronal Workspace Theory",
      architects: "Bernard Baars, Stanislas Dehaene, Jean-Pierre Changeux",
      year: "1988 / 2001",
      coreIdea: "Consciousness is the global broadcasting of information across long-range excitatory pyramidal neurons, breaking local modular isolation.",
      mechanism: "Subliminal sensory inputs process locally in sensory cortices (e.g. V1/V2). When stimulus strength surpasses a non-linear threshold (~300ms post-stimulus), it triggers all-or-none 'ignition' in a frontoparietal workspace network. Information is broadcast system-wide, enabling memory storage, verbal report, and deliberate motor planning.",
      keyFormula: "P(Ignition) = \\frac{1}{1 + e^{-\\beta(S - \\theta)}}",
      substrate: "Layer II/III & V pyramidal neurons with long-distance axon collaterals linking dorsolateral prefrontal cortex (dlPFC) & posterior parietal cortex (PPC).",
      empiricalEvidence: "P3b wave in EEG at ~300ms, fMRI frontoparietal BOLD surge during conscious vs subliminal visual masking.",
      tag: "Global Broadcast"
    },
    {
      id: "iit",
      acronym: "IIT 4.0",
      name: "Integrated Information Theory",
      architects: "Giulio Tononi, Christof Koch, Larissa Albantakis",
      year: "2004 / 2023",
      coreIdea: "Consciousness is an intrinsic, fundamental property of any physical system with non-zero irreducible cause-effect power (Φ).",
      mechanism: "IIT starts from phenomenological axioms (existence, composition, information, integration, exclusion) and derives the physical postulates required of a substrate. A system is conscious if its whole specifies more causal information than the sum of its partitioned sub-components. The structure of experience corresponds to the geometry of its cause-effect structure in multi-dimensional space.",
      keyFormula: "\\Phi^{max} = \\min_{P} D(p(x_t | x_{t-1}) \\parallel \\prod_{k} p(x_t^k | x_{t-1}^k))",
      substrate: "Posterior cortical 'hot zone' (temporo-parieto-occipital junction), highly recurrent grid-like local micro-architectures.",
      empiricalEvidence: "Perturbational Complexity Index (PCI) via TMS-EEG, accurately differentiating coma, anesthesia, REM sleep, and awake states.",
      tag: "Information Geometry"
    },
    {
      id: "fep",
      acronym: "PP / FEP",
      name: "Predictive Processing & Active Inference",
      architects: "Karl Friston, Andy Clark, Anil Seth",
      year: "2010 / 2021",
      coreIdea: "The conscious scene is a 'controlled hallucination' — the brain's best top-down generative hypothesis predicting incoming sensory flow.",
      mechanism: "The brain is an inference engine continually generating descending top-down predictions to cancel out ascending bottom-up sensory signals. Consciousness corresponds to the high-level, precision-weighted generative models of the internal state (interoception) and external environment, minimizing variational free energy via action and perception.",
      keyFormula: "F = \\mathbb{E}_{q}[\\ln q(\\vartheta) - \\ln p(s, \\vartheta)] \\ge -\\ln p(s)",
      substrate: "Hierarchical cortical canonical microcircuits; deep layers send predictions downward, superficial layers transmit prediction errors upward.",
      empiricalEvidence: "Mismatch negativity (MMN), binocular rivalry dynamics, somatic illusion paradigms (Rubber Hand Illusion).",
      tag: "Bayesian Engine"
    },
    {
      id: "hot",
      acronym: "HOT",
      name: "Higher-Order Thought Theory",
      architects: "David Rosenthal, Hakwan Lau, Richard Brown",
      year: "1997 / 2019",
      coreIdea: "A mental state becomes conscious only when represented by another metacognitive, higher-order state targeting it.",
      mechanism: "First-order sensory representations (e.g. seeing a red apple in visual cortex) remain unconscious on their own. Conscious awareness requires a secondary meta-representation in the prefrontal cortex stating 'I am experiencing a red apple'. Metacognitive monitoring converts raw information into conscious subjective reportability.",
      keyFormula: "M(S) \\xrightarrow{Meta} HOT(M(S))",
      substrate: "Anterior prefrontal cortex (Brodmann Area 10 / rostrolateral PFC) and frontopolar metacognitive nodes.",
      empiricalEvidence: "Metacognitive d-prime variations; prefrontal lesion blindsight (type II) where subjects perform tasks without feeling conscious.",
      tag: "Metacognitive Monitoring"
    },
    {
      id: "rpt",
      acronym: "RPT",
      name: "Recurrent Processing Theory",
      architects: "Victor Lamme, Pieter Roelfsema",
      year: "2000 / 2010",
      coreIdea: "Phenomenal consciousness arises from localized feedback (recurrent) loops within sensory cortices, independent of prefrontal access.",
      mechanism: "Visual processing unfolds in two stages: (1) Fast feedforward sweep (unconscious extraction of features), followed by (2) Local recurrent processing where higher visual areas send feedback to V1. This localized recurrence produces phenomenal consciousness ('rich qualia'), even if not attended or reportable via frontoparietal access.",
      keyFormula: "V1 \\underset{Feedforward}{\\xrightarrow{\\quad}} V4/IT \\underset{Feedback}{\\xleftarrow{\\quad}} V1",
      substrate: "Local feedback projections between sensory hierarchy (V1, V2, V4, MT, IT).",
      empiricalEvidence: "Transcranial Magnetic Stimulation (TMS) to V1 disrupts visual awareness when applied 100ms post-stimulus (blocking feedback), but not during the initial feedforward sweep.",
      tag: "Sensory Recurrence"
    },
    {
      id: "orchor",
      acronym: "Orch-OR",
      name: "Orchestrated Objective Reduction",
      architects: "Roger Penrose, Stuart Hameroff",
      year: "1996 / 2014",
      coreIdea: "Consciousness arises from quantum computations inside neuronal microtubules orchestrated by biological memory and collapsed by quantum gravity.",
      mechanism: "Tubulin protein dimers in the cytoskeletal lattice of neurons act as quantum bits (qubits), maintaining quantum superposition across extended networks. When the gravitational self-energy separation reaches the threshold $E = \\hbar / t$, objective reduction (OR) occurs, producing non-computable conscious moments ('proto-conscious quales').",
      keyFormula: "E = \\frac{\\hbar}{t} \\quad (\\text{Penrose-Diósi OR threshold})",
      substrate: "Cytoskeletal microtubules in dendrites and soma of cortical pyramidal neurons; gap junctions maintaining macroscopic quantum coherence.",
      empiricalEvidence: "Anesthetic gas binding sites within hydrophobic pockets of tubulin; terahertz resonance observed in neuronal microtubules.",
      tag: "Quantum Biology"
    }
  ],

  archiveCards: [
    {
      id: "arch-01",
      category: "Thought Experiment",
      title: "Mary's Room (The Knowledge Argument)",
      originator: "Frank Jackson, 1982",
      excerpt: "Mary is a brilliant neuroscientist who investigates vision from a black-and-white room. She knows every physical fact about color vision (wavelengths, retinal cone excitation, V4 cortex activation). When released into the colorful world, does she learn anything new?",
      significance: "Demonstrates the explanatory gap between physical description and phenomenal qualia (the subjective 'what it is like' to see red).",
      tag: "Qualia / Physicalism"
    },
    {
      id: "arch-02",
      category: "Neuropathology",
      title: "Blindsight (Cortical Blindness)",
      originator: "Lawrence Weiskrantz, 1974",
      excerpt: "Patients with damage to primary visual cortex (V1) report complete blindness in their scotoma. However, when forced to guess the orientation of a laser or catch an object, they succeed at rates significantly above chance.",
      significance: "Proves that visual information processing and motor coordination can proceed entirely unconsciously without phenomenal awareness.",
      tag: "Phenomenal vs Access"
    },
    {
      id: "arch-03",
      category: "Paradox",
      title: "Tononi's Cerebellum Paradox",
      originator: "Giulio Tononi, 2004",
      excerpt: "The human cerebellum contains approximately 69 billion neurons (nearly 80% of the entire brain), yet its complete surgical resection or agenesis causes no loss of consciousness, whereas damage to small thalamocortical loops causes immediate coma.",
      significance: "Confirms that raw neuron count is irrelevant; consciousness requires recurrent, non-modular integrated network topologies rather than feedforward modular chains.",
      tag: "Network Topology"
    },
    {
      id: "arch-04",
      category: "Neuropathology",
      title: "Split-Brain Syndrome (Callosotomy)",
      originator: "Roger Sperry & Michael Gazzaniga, 1968",
      excerpt: "Surgical transection of the corpus callosum to treat intractable epilepsy divides the two cerebral hemispheres. Experiments show each hemisphere can process information, initiate motor tasks, and exhibit independent consciousness.",
      significance: "Shows that consciousness is not an indivisible metaphysical entity, but a unified field capable of splitting into two distinct conscious agents.",
      tag: "Unified Field"
    },
    {
      id: "arch-05",
      category: "Empirical Protocol",
      title: "Perturbational Complexity Index (PCI)",
      originator: "Marcello Massimini, 2013",
      excerpt: "A direct clinical probe of consciousness: a high-density TMS magnetic pulse 'zaps' the cortex, and multichannel EEG records the complexity and spread of the resulting reverberation. Compressed using Lempel-Ziv algorithm.",
      significance: "Yields a scalar value (0.0 to 1.0) with an absolute threshold (~0.31) that reliably predicts conscious presence across coma, vegetative state, locked-in, and anesthesia.",
      tag: "Clinical Measurement"
    },
    {
      id: "arch-06",
      category: "Thought Experiment",
      title: "The Philosophical Zombie (P-Zombie)",
      originator: "David Chalmers, 1996",
      excerpt: "A hypothetical being that is physically and behaviorally identical to a normal human in every conceivable physical aspect, but possesses zero inner subjective experience (all dark inside).",
      significance: "Used to argue that functionalism and physicalism cannot account for phenomenal consciousness; experience is an additional ontology beyond physical structure.",
      tag: "Metaphysics"
    },
    {
      id: "arch-07",
      category: "Neuroscience Paradigm",
      title: "The Frontoparietal Ignition Dynamic",
      originator: "Stanislas Dehaene, 2006",
      excerpt: "Subliminal words activate the visual word form area for ~200ms before decaying. Conscious words trigger a sudden, massive burst of synchronized gamma oscillations and recurrent frontoparietal activity after 270ms.",
      significance: "Marks the distinct electrophysiological threshold between unconscious unconscious priming and conscious global access.",
      tag: "Electrophysiology"
    },
    {
      id: "arch-08",
      category: "Cognitive Illusion",
      title: "Rubber Hand Illusion & Body Ownership",
      originator: "Matthew Botvinick & Jonathan Cohen, 1998",
      excerpt: "By stroking a hidden real hand and a visible rubber hand in synchrony, the brain incorporates the artificial limb into its internal body schema within minutes. When threatened with a hammer, skin conductance spikes instantly.",
      significance: "Illustrates that the subjective boundary of the self is dynamically generated through multi-sensory Bayesian predictive binding.",
      tag: "Selfhood / Embodiment"
    },
    {
      id: "arch-09",
      category: "Altered State",
      title: "The Entropic Brain & REBUS Model",
      originator: "Robin Carhart-Harris & Karl Friston, 2019",
      excerpt: "Under high-affinity 5-HT2A agonist psychedelics (psilocybin, LSD), high-level hierarchical priors (the Default Mode Network) relax ('Relaxed Beliefs Under Psychedelics'), increasing entropy and allowing raw bottom-up sensory flow to flood consciousness.",
      significance: "Provides a mathematical model of ego dissolution and mystical experience as the breakdown of rigid predictive priors.",
      tag: "Entropy & Ego"
    }
  ],

  glossary: [
    {
      term: "Qualia",
      def: "The individual instances of subjective, conscious experience (e.g., the redness of red, the taste of wine, the pain of a burn)."
    },
    {
      term: "Φ (Phi)",
      def: "The quantitative measure of integrated information in a system beyond the sum of its individual parts, measured in bits."
    },
    {
      term: "NCC (Neural Correlates of Consciousness)",
      def: "The minimal set of neural events and mechanisms sufficient for a specific conscious percept."
    },
    {
      term: "Markov Blanket",
      def: "A statistical boundary separating an organism's internal states from the external environment, crucial for maintaining autonomous identity."
    },
    {
      term: "Blindsight",
      def: "The ability of visually blind individuals with striate cortex lesions to accurately respond to visual stimuli without conscious awareness."
    },
    {
      term: "Explanatory Gap",
      def: "The conceptual divide between physical brain processes and the qualitative nature of subjective mental states (Joseph Levine, 1983)."
    },
    {
      term: "Ignition",
      def: "A non-linear, avalanche-like surge in frontoparietal synchronization that makes a stimulus globally accessible to the mind."
    },
    {
      term: "Default Mode Network (DMN)",
      def: "An interconnected brain network (medial PFC, posterior cingulate) active during self-referential thought, autobiographical memory, and mind wandering."
    }
  ],

  milestones: [
    { year: "1641", title: "René Descartes — Dualist Interactionism", desc: "Formulates the mind-body split (*Res Cogitans* vs *Res Extensa*) and pines the pineal gland as the intersection." },
    { year: "1890", title: "William James — Stream of Consciousness", desc: "Defines consciousness as a continuous, dynamic stream characterized by selective attention and personal ownership." },
    { year: "1974", title: "Thomas Nagel — 'What is it like to be a bat?'", desc: "Establishes that subjective experience cannot be fully translated into third-person objective physical accounts." },
    { year: "1990", title: "Crick & Koch — Neural Correlates Manifesto", desc: "Proposes an empirical search for 40 Hz gamma oscillations and synchronized neuronal coalitions." },
    { year: "1995", title: "David Chalmers — The Hard Problem", desc: "Splits cognitive tasks into functional Easy Problems and phenomenal Hard Problem at the Tucson Conference." },
    { year: "1998", title: "Bernard Baars — Global Workspace Architecture", desc: "Presents the theater metaphor of conscious access and cortical broadcast networks." },
    { year: "2004", title: "Giulio Tononi — Integrated Information Theory", desc: "Mathematizes consciousness as irreducible causal power Φ (Phi) in complex systems." },
    { year: "2013", title: "Marcello Massimini — PCI Consciousness Probe", desc: "Invents TMS-EEG perturbational complexity index to detect awareness in non-communicative patients." },
    { year: "2023", title: "Cogitate Consortium — GNWT vs IIT Adversarial Test", desc: "First large-scale multi-lab empirical test directly pitting Global Workspace against Integrated Information predictions." }
  ],

  institutions: [
    { name: "Allen Institute for Brain Science", location: "Seattle, USA", lead: "Christof Koch" },
    { name: "Center for Consciousness Science", location: "University of Michigan", lead: "George Mashour" },
    { name: "Sackler Centre for Consciousness Science", location: "University of Sussex", lead: "Anil Seth" },
    { name: "Max Planck Institute for Biological Cybernetics", location: "Tübingen, Germany", lead: "Nikos Logothetis" },
    { name: "Cognitive Neuroimaging Unit (INSERM)", location: "NeuroSpin, Paris", lead: "Stanislas Dehaene" },
    { name: "Center for Sleep and Consciousness", location: "University of Wisconsin-Madison", lead: "Giulio Tononi" },
    { name: "Center for Mind, Brain and Consciousness", location: "New York University", lead: "David Chalmers & Ned Block" },
    { name: "Wellcome Centre for Human Neuroimaging", location: "UCL London", lead: "Karl Friston" }
  ]
};
