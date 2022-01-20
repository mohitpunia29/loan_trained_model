import MIMI_AI_PLATFORM_IMAGE from '../../../static/home/ai-platform.png';
import MIMI_VISION_IMAGE from '../../../static/home/VisionWhiteIcon.png';
import MIMI_LANGUAGE_IMAGE from '../../../static/home/LanguageWhiteIcon.png';
import MIMI_DATA_IMAGE from '../../../static/home/DataWhiteIcon.png';
import MIMI_AUDIO_IMAGE from '../../../static/home/AudioWhiteIcon.png';
import MIMI_COGNITION_IMAGE from '../../../static/home/CognitionWhiteIcon.png';

export const MIMI_AI_PLATFORM = {
  header: 'Explore the Mimi AI platform',
  products: [
    {
      name       : 'Mimi AI Platform',
      icon       : MIMI_AI_PLATFORM_IMAGE,
      header     : 'The transformative magic of machine intelligence',
      description:
        "Entefy solutions are powered by the Mimi AI Platform's advanced AI and machine learning models in computer vision, natural language processing and generation, audio intelligence, time series, and other data insights. Working in concert, these capabilities form the cognitive intelligence of MimiCognition.",
      benefits: [],
      features: []
    },
    {
      name: 'MimiVision',
      icon: MIMI_VISION_IMAGE,
      header: 'Machine vision measured in billions of parameters',
      description:
        'A picture is worth far more than 1,000 words. Entefy&#39;s computer vision technology involves the training of multiple deep neural networks composed of many narrow and wide layers. Each training requires the estimation of approximately 1 billion parameters/coefficients with each coefficient roughly corresponding to a neuron. The final ensemble of models is optimized and fine-tuned for detecting objects, attributes, and relationships in images and videos.',
      benefits: [],
      features: [
        'Object classification',
        'Object detection',
        'Scene detection and analysis',
        'Facial recognition',
        'Facial analysis (including emotion, age, gender)',
        'Contextualization',
        'Similarity-based retrieval',
        'Object-to-object mapping and relationships',
        'Object tracking in video',
        'Color identification',
        'Depth, focus, and saliency',
        'Logo detection',
        'Celebrity recognition',
        'Places of interest',
        'Optical character recognition (OCR)'
      ]
    },
    {
      name: 'MimiLanguage',
      icon: MIMI_LANGUAGE_IMAGE,
      header: 'Context-aware natural language intelligence',
      description:
        'Entefy&#39;s natural language processing (NLP) and natural language understanding (NLU) technologies use deep learning and other machine learning methods to enable advanced cognitive AI that detects meaning and intent in structured and unstructured data. This enables a multitude of valuable capabilities including entity recognition, information extraction, intent analysis, and summarization, all of which increase the value and discoverability of text-based data.',
      benefits: [],
      features: [
        'Part-of-speech tagging',
        'Semantic parsing',
        'Spelling and grammar correction',
        'Q&A engine',
        'Topic modeling',
        'Entity extraction',
        'Relationship extraction',
        'Sentiment analysis',
        'Topic segmentation',
        'Word sense disambiguation',
        'Intent analysis',
        'Concept mapping',
        'Context mapping',
        'Machine summarization',
        'High-speed concept mapping'
      ]
    },
    {
      name: 'MimiData',
      icon: MIMI_DATA_IMAGE,
      header: 'Time series and other data insights',
      description:
        'Understand the past, the present, and know what to expect in the future. Entefy&#39;s data intelligence models allow users to transform structured and unstructured data into meaning. Important correlations, anomalies, and predictions are just a few of the many advanced insights that can be derived from smart sensors, network activity, global news, health systems, financial transactions, and other sources of data.',
      benefits: [],
      features: [
        'Forecasts & predictive strategies',
        'Univariate and multivariate time-series forecasting',
        'Simultaneous analysis of disparate data sources',
        'Automated management of data duplication and stale data',
        'Health and failure analysis and prediction',
        'Batch and real-time analysis of patterns, anomalies, concepts, and actions',
        'Data intelligence support for Mimi SmartAgent',
        'Automatic risk and KPI analysis',
        'Support for batch and online learning',
        'Seamless integration available for MimiVision, MimiLanguage, and MimiAudio',
        'Support for diverse data streams from third-party services, apps, and IoT smart devices'
      ]
    },
    {
      name: 'MimiAudio',
      icon: MIMI_AUDIO_IMAGE,
      header: 'Valuable insight from audio/video data',
      description:
        'With Entefy&#39;s machine learning models for audio stream processing, users can make use of audio information embedded in recordings, presentations, videos, user-generated content, and more. This translates to new capabilities for your team and better intelligence for you and your organization.',
      benefits: [],
      features: [
        'Audio information retrieval',
        'Audio source separation',
        'Classification of audio streams for speech, music, and other categories',
        'Speech transcription',
        'Speaker detection',
        'Sentiment analysis',
        'Audio disambiguation',
        'Speech generation'
      ]
    },
    {
      name: 'MimiCognition',
      icon: MIMI_COGNITION_IMAGE,
      header: 'Human inspiration, machine precision',
      description:
        'Inspired by human reasoning and understanding, smart machines are becoming smarter. Much smarter. Entefy&#39;s cognitive system incorporates multiple machine learning models in computer vision, natural language, audio, time series, and other data intelligence to better understand concepts and contexts. MimiCognition is designed for higher-level cognitive tasks for machines.',
      benefits: [],
      features: [
        'Intelligence, insights, and actions',
        'Multi-modal knowledge extraction',
        'High-frequency event correlation analysis',
        'Cross-modal entity recognition and understanding',
        'Dynamic intent analysis for workflow integration',
        'Real-time intent-context mapping and execution',
        'Support for user-specific context learning and intent management',
        'Batch and online learning capable',
        'Broad support for structured and unstructured data',
        'Seamless integration with MimiVision, MimiLanguage, MimiAudio, and MimiData',
        'Granular data access controls and policy management capabilities ',
        'Support for secure enclave and compute sandbox implementations ',
        'Full data storage integration with internal and external repositories ',
        'Support for Mimi SmartAgent'
      ]
    }
  ]
};
