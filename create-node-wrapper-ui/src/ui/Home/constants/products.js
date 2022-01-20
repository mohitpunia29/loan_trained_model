import FIND_IMAGE from '../../../static/home/solutions/find.png';
import INSIGHT_IMAGE from '../../../static/home/solutions/insight.png';
import ILLUMINATE_IMAGE from '../../../static/home/solutions/illuminate.png';
import SMARTAGENT_IMAGE from '../../../static/home/solutions/mimi.png';
import SECURE_IMAGE from '../../../static/home/solutions/secure.png';
import COMMUNICATOR_IMAGE from '../../../static/home/solutions/communicator.png';
import VISUALIZE_IMAGE from '../../../static/home/solutions/visualize.png';

export const PRODUCTS = {
  header: 'Explore user applications',
  products: [
    {
      name  : 'SmartAgent',
      icon  : SMARTAGENT_IMAGE,
      header:
        'Autonomous AI agent that completes complex cognitive tasks using everyday natural language in text or speech',
      description:
        "Today's virtual assistants can give you the weather, a news headline, or play your favorite song, but try giving them complex tasks and voila. Awkward silence or \"Sorry, I didn't get that.\" Then there's Mimi SmartAgent, powered by Entefy's patented Mimi AI Platform. Everything from routine tasks such as pattern recognition to high-value activities including optimizing and planning<sup>1</sup> are only one natural language command away from completion. ",
      benefits: [
        {
          highlight: 'Time savings.',
          text     :
            'Free up your hours with the first AI agent that truly works on your behalf.'
        },
        {
          highlight: 'Simplicity.',
          text:
            'Complete complex tasks easily using an intuitive conversational interface.'
        },
        {
          highlight: 'Freedom.',
          text     :
            'Offload your routine tasks to free up time for other activities.'
        },
        {
          highlight: 'Universal access.',
          text:
            'Gain access to Entefy applications including Find, Illuminate, and Insight.'
        }
      ],
      features: [
        'Next-generation autonomous AI agent capabilities',
        'Converse naturally via voice or text',
        'Advanced knowledge extraction',
        'Proprietary computer vision, natural language, and audio intelligence',
        'Complex query and multi-command understanding',
        'AI-powered message composition and send',
        'User-Mimi seamless task exchange',
        'Interaction with any contact or connected service, app, or IoT smart device'
      ]
    },
    {
      name  : 'Find',
      icon  : FIND_IMAGE,
      header: 
        'Intelligent context-aware information discovery to access valuable knowledge hidden in structured and unstructured data',
      description:
        'Knowledge workers devote an average of 36% of their workdays to finding and consolidating the information they need to get their jobs done.<sup>1</sup> And 61% of them need to access 4 or more systems just to locate what they need.<sup>2</sup> Entefy Find directly addresses these inefficiencies, making information discovery as natural and intuitive as speaking in plain language.',
      benefits: [
        {
          highlight: 'Precision & speed.',
          text: 'Find exactly what you need in exponentially less time.'
        },
        {
          highlight: 'Access.',
          text:
            'Locate valuable information typically invisible to traditional search solutions.'
        },
        {
          highlight: 'Flexibility.',
          text: 'Discover knowledge using any of your favorite devices.'
        },
        {
          highlight: 'Intelligence.',
          text:
            'Say goodbye to keyword search and hello to context and meaning.'
        },
        {
          highlight: 'Simplicity.',
          text:
            'Make query requests using natural language without complex syntax or user training.'
        }
      ],
      features: [
        'AI-powered search and discovery',
        'Object classification and detection in images and videos',
        'Knowledge extraction',
        'Proprietary relevancy model and personalized ranking algorithms',
        'Context-aware search refinement',
        'Voice- and text-enabled conversational interface',
        'Support for all popular file types',
        'Support for third-party data sources',
        'Broad third-party services support',
        'Lightning-fast search query response time',
        'Compatibility with directory and authentication systems',
        'On-premise or Entefy private SaaS deployments'
      ]
    },
    {
      name: 'Insight',
      icon: INSIGHT_IMAGE,
      header:
        'Data analytics to deliver valuable insights using conversational language, even for complex queries',
      description:
        'Most data tells the story of the past. Which is why leading innovators are prioritizing Big Data analytics as a primary focus area for the years ahead<sup>1</sup>—addressing the more than $3 trillion wasted annually by data quality problems.<sup>2</sup> With Entefy Insight, data tells the story of the past, the present, and the future.',
      benefits: [
        {
          highlight: 'Agility.',
          text: 'Adjust to changing requirements on demand.'
        },
        {
          highlight: 'Speed.',
          text: 'Save time getting insights in record time.'
        },
        {
          highlight: 'Precision.',
          text: 'Discover targeted insights independent of data size or format.'
        },
        {
          highlight: 'Efficiency.',
          text: 'Manage data growth automatically.'
        },
        {
          highlight: 'Performance & productivity.',
          text: 'Reduce risk and improve KPIs with smarter data.'
        },
        {
          highlight: 'More uptime.',
          text: 'Avoid costly downtime with accurate failure prediction.'
        }
      ],
      features: [
        'Simultaneous analysis of disparate data sources',
        'Risk and KPI management',
        'Highly intuitive, no code writing required',
        'Automated data management',
        'Asset health and failure prediction',
        'Advanced context analysis'
      ]
    },
    {
      name: 'Illuminate',
      icon: ILLUMINATE_IMAGE,
      header:
        'AI-powered knowledge platform that discovers the meaning of any data in virtually any format or location',
      description:
        'Most large companies are producing and collecting data with the hope that they\'ll be able to make productive use of it...someday. According to IDC, 90% of digital information is unstructured content like email, videos, and documents.<sup>1</sup> Experts are beginning to see the potential for artificial intelligence as a solution to information overload. Yet 86% of enterprises are still waiting for AI to make its impact.<sup>2</sup> At Entefy, we are making "someday" today. Using our proprietary machine learning models in computer vision, natural language, audio signals, and other domains, Illuminate pulls data from any number of repositories and then contextualizes the information without the need for manual tags or filenames. Illuminate is the AI-powered knowledge platform that transforms unproductive data into a high-value resource.',
      benefits: [
        {
          highlight: 'Go deep.',
          text:
            'Discover valuable knowledge typically invisible to other technologies.'
        },
        {
          highlight: 'Flexibility.',
          text: 'Process structured and unstructured data with ease.'
        },
        {
          highlight: 'Intelligence.',
          text:
            'Transform idle, unproductive data into the raw material for actionable insight.'
        },
        {
          highlight: 'Effortless.',
          text: 'Replace manual tagging with automated context discovery.'
        }
      ],
      features: [
        'State-of-the-art object classification and detection in images and videos',
        'Facial recognition and analysis',
        'Knowledge extraction',
        'Natural language understanding',
        'Structured and unstructured data support',
        'Support for third-party data sources',
        'Classification and analysis of audio streams',
        'Automatic document summarization',
        'Support for multiple devices, OSes, and browsers',
        'Proprietary data processing',
        'Compatibility with directory and authentication systems',
        'Monitoring, logging, and reporting options',
        'On-premise or Entefy private SaaS deployments'
      ]
    },
    {
      name: 'Secure',
      icon: SECURE_IMAGE,
      header:
        'Unparalleled cybersecurity and data privacy designed to ensure the protection of sensitive information',
      description:
        'As the transition to the public cloud accelerates, big challenges are beginning to emerge in a variety of areas including security, privacy, cost, governance, and compliance. Entefy Secure means not having to worry about the management and distribution of sensitive material. The sophisticated encryption process backing Secure leverages a multi-layered architecture that allows for storage of encrypted user files in our private environment or yours.',
      benefits: [
        {
          highlight: 'Control.',
          text:
            'Gain unprecedented command over your data, even after it has been shared.'
        },
        {
          highlight: 'Simplicity.',
          text:
            'Embed permissions directly into files to avoid complex administration and coordination.'
        },
        {
          highlight: 'Compliance.',
          text:
            'Simplify recordkeeping for regulatory reporting and legal requirements.'
        },
        {
          highlight: 'Depth.',
          text:
            'Protect the storage and transmission of your data with multi-layer encryption.'
        },
        {
          highlight: 'Confidence.',
          text:
            'Share sensitive data without worries even when it is stored in the cloud.'
        }
      ],
      features: [
        'Dynamic access and content permissioning',
        'Adaptive Privacy Controls (APC) for real-time access permissioning',
        'Text-based smart encryption for documents and messages',
        'Pixel-based smart encryption for images and videos',
        'Secure email support',
        'Secure team collaboration support',
        'Multi-Factor Authentication',
        'On-premise or Entefy private SaaS deployments'
      ]
    },
    {
      name: 'Communicator',
      icon: COMMUNICATOR_IMAGE,
      header:
        'The first universal communicator to enable digital interaction with people, services, and smart devices, all from a single application',
      description:
        "More than 100 trillion IM, email, and SMS messages are transmitted every year.<sup>1,2</sup> 4+ million apps are available on the app stores.<sup>3</sup> 200 billion Internet of Things (IoT) devices are expected by 2020.<sup>4</sup> Our available time and attention? Extremely limited. In today's world of information overload, our natural ability to separate signal from noise isn't cutting it. In response, Entefy has built the first-ever <i>universal communicator</i> that puts the world of people, services, and smart things inside a single application that runs on all your favorite devices.",
      benefits: [
        {
          highlight: 'Productivity.',
          text: 'Save time so you can live and work better.'
        },
        {
          highlight: 'Efficiency.',
          text:
            'Accomplish more with your apps, contacts, services, devices, and smart things, all from a single application.'
        },
        {
          highlight: 'Simplicity.',
          text: 'Reduce the technical complexity of your digital universe.'
        },
        {
          highlight: 'Unified experience.',
          text: 'Seamless connectivity as you move from device to device.'
        },
        {
          highlight: 'Conversational interface.',
          text: 'Power your day with Mimi SmartAgent.'
        }
      ],
      features: [
        'Multi-protocol communication (email, text, IM, live voice & video)',
        'Multi-format communication (audio, photo, video, text)',
        'Natural conversations with third-party services and IoT smart devices',
        'Context-aware messaging',
        'Intelligent storage including third-party integrations',
        'Third-party support for services, apps, and IoT smart devices',
        'Rich administrative capabilities',
        'Universal contact management',
        'Smart calendar',
        'Advanced encryption and privacy controls'
      ]
    },
    {
      name: 'Visualize',
      icon: VISUALIZE_IMAGE,
      header:
        'Visual data dashboard to enable AI-powered monitoring and reporting',
      description:
        'Your organization is generating and collecting countless data streams. The challenge is how to best derive value from all of that information. And the pressure is on: Forrester projects that by 2020 insights-driven businesses will take away $1.2 trillion annually from their less-informed competitors.<sup>1</sup> Identifying trends, predicting outages, mapping correlations across business processes—that’s the domain of Entefy Visualize.',
      benefits: [
        {
          highlight: 'Clarity.',
          text: 'Visualize insights derived from diverse data streams.'
        },
        {
          highlight: 'Productivity.',
          text: 'Streamline research and reporting with the power of AI.'
        },
        {
          highlight: 'Connections.',
          text: 'Identify previously hidden relationships and correlations.'
        },
        {
          highlight: 'Trendspotting.',
          text: 'Leverage advanced AI to visualize trends and patterns.'
        },
        {
          highlight: 'Proactivity.',
          text: 'See into the future.'
        }
      ],
      features: [
        'Data visualization and reporting for communication, collaboration, IoT, logs, and other activities',
        'Internal and public cloud data repositories',
        'Anomaly detection',
        'Access permissioning and security monitoring',
        'Alerts for system downtime and device failure',
        'Role-based notifications',
        'Broad support for structured and unstructured data',
        'On-premise or Entefy private SaaS deployments'
      ]
    }
  ]
};
