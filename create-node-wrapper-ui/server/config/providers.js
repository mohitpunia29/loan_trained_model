module.exports = {
  entefy: {
    domain      : {
      newApi: process.env.NTFY_CFG_ENTEFY_NEW_API_DOMAIN || process.env.NTFY_CFG_ENTEFY_DOMAIN || 'https://ai-demo.entefy.com',
      oldApi: process.env.NTFY_CFG_ENTEFY_OLD_API_DOMAIN || process.env.NTFY_CFG_ENTEFY_DOMAIN || 'https://sandbox-v2.entefy.com'
    },
    clientConfig: {
      name       : 'entefy',
      displayName: 'Entefy',
      apiVersion : '0.0.1',
      color      : '#2196F3',
      models     : {
        LOGO_DETECTION_V1: {
          key        : 'LOGO_DETECTION_V1',
          id         : 'logo-20',
          displayName: 'Logo-v1'
        },
        LOGO_DETECTION_V2: {
          key        : 'LOGO_DETECTION_V2',
          id         : 'logo-40',
          displayName: 'Logo-v2'
        },
        LOGO_DETECTION_V3: {
          key        : 'LOGO_DETECTION_V3',
          id         : 'logo-50',
          displayName: 'Logo-v3'
        },
        VEHICLE_DETECTION: {
          key        : 'VEHICLE_DETECTION',
          id         : 'vehicle-detection',
          displayName: 'Vehicle detection'
        },
        PROPOSED_TAGS_V1: {
          key        : 'PROPOSED_TAGS_V1',
          id         : 'proposed-tags-v1',
          displayName: 'Proposed Tags',
          usesOldApi : true
        },
        DMODEL9_V1: {
          key        : 'DMODEL9_V1',
          id         : 'dmodel9-v1',
          displayName: 'CV 9000',
          usesOldApi : true
        },
        FACE_DETECTOR_DNN_V1: {
          key        : 'FACE_DETECTOR_DNN_V1',
          id         : 'face-detector-dnn-v1',
          displayName: 'Face Detector',
          usesOldApi : true
        },
        PLACES_FUSION_V1: {
          key        : 'PLACES_FUSION_V1',
          id         : 'places-fusion-v1',
          displayName: 'Places Fusion',
          usesOldApi : true
        }
      }
    }
  },
  clarifai: {
    apiKey      : process.env.NTFY_CFG_CLARIFAI_API_KEY,
    domain      : process.env.NTFY_CFG_CLARIFAI_DOMAIN || 'https://api.clarifai.com',
    clientConfig: {
      name       : 'clarifai',
      displayName: 'Clarifai',
      apiVersion : '2.8.0',
      color      : '#FF5722',
      // https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
      models     : {
        GENERAL_MODEL: {
          key        : 'GENERAL_MODEL',
          id         : 'aaa03c23b3724a16a56b629203edc62c',
          displayName: 'General'
        },
        FOOD_MODEL: {
          key        : 'FOOD_MODEL',
          id         : 'bd367be194cf45149e75f01d59f77ba7',
          displayName: 'Food'
        },
        TRAVEL_MODEL: {
          key        : 'TRAVEL_MODEL',
          id         : 'eee28c313d69466f836ab83287a54ed9',
          displayName: 'Travel'
        },
        NSFW_MODEL: {
          key        : 'NSFW_MODEL',
          id         : 'e9576d86d2004ed1a38ba0cf39ecb4b1',
          displayName: 'NSFW'
        },
        WEDDINGS_MODEL: {
          key        : 'WEDDINGS_MODEL',
          id         : 'c386b7a870114f4a87477c0824499348',
          displayName: 'Weddings'
        },
        WEDDING_MODEL: {
          key        : 'WEDDING_MODEL',
          id         : 'c386b7a870114f4a87477c0824499348',
          displayName: 'Wedding'
        },
        COLOR_MODEL: {
          key        : 'COLOR_MODEL',
          id         : 'eeed0b6733a644cea07cf4c60f87ebb7',
          displayName: 'Color'
        },
        CLUSTER_MODEL: {
          key        : 'CLUSTER_MODEL',
          id         : 'cccbe437d6e54e2bb911c6aa292fb072',
          displayName: 'Cluster'
        },
        FACE_DETECT_MODEL: {
          key        : 'FACE_DETECT_MODEL',
          id         : 'a403429f2ddf4b49b307e318f00e528b',
          displayName: 'Face detection'
        },
        FOCUS_MODEL: {
          key        : 'FOCUS_MODEL',
          id         : 'c2cf7cecd8a6427da375b9f35fcd2381',
          displayName: 'Focus'
        },
        LOGO_MODEL: {
          key        : 'LOGO_MODEL',
          id         : 'c443119bf2ed4da98487520d01a0b1e3',
          displayName: 'Logo'
        },
        DEMOGRAPHICS_MODEL: {
          key        : 'DEMOGRAPHICS_MODEL',
          id         : 'c0c0ac362b03416da06ab3fa36fb58e3',
          displayName: 'Demographics'
        },
        GENERAL_EMBED_MODEL: {
          key        : 'GENERAL_EMBED_MODEL',
          id         : 'bbb5f41425b8468d9b7a554ff10f8581',
          displayName: 'General embed'
        },
        FACE_EMBED_MODEL: {
          key        : 'FACE_EMBED_MODEL',
          id         : 'd02b4508df58432fbb84e800597b8959',
          displayName: 'Face embed'
        },
        APPAREL_MODEL: {
          key        : 'APPAREL_MODEL',
          id         : 'e0be3b9d6a454f0493ac3a30784001ff',
          displayName: 'Apparel'
        },
        MODERATION_MODEL: {
          key        : 'MODERATION_MODEL',
          id         : 'd16f390eb32cad478c7ae150069bd2c6',
          displayName: 'Moderation'
        },
        TEXTURES_AND_PATTERNS: {
          key        : 'TEXTURES_AND_PATTERNS',
          id         : 'fbefb47f9fdb410e8ce14f24f54b47ff',
          displayName: 'Textures and patterns'
        },
        LANDSCAPE_QUALITY: {
          key        : 'LANDSCAPE_QUALITY',
          id         : 'bec14810deb94c40a05f1f0eb3c91403',
          displayName: 'Landscape quality'
        },
        PORTRAIT_QUALITY: {
          key        : 'PORTRAIT_QUALITY',
          id         : 'de9bd05cfdbf4534af151beb2a5d0953',
          displayName: 'Portrait quality'
        }
      }
    }
  },
  ibmVisualRecognition: {
    apiKey      : process.env.NTFY_CFG_IBM_VISUAL_RECOGNITION_API_KEY,
    domain      : process.env.NTFY_CFG_IBM_VISUAL_RECOGNITION_DOMAIN || 'https://gateway.watsonplatform.net/visual-recognition/api/v3',
    clientConfig: {
      name       : 'ibmVisualRecognition',
      displayName: 'IBM Watson Visual Recognition',
      apiVersion : '3.0',
      color      : '#9855d4',
      models     : {
        GENERAL: {
          key        : 'GENERAL',
          id         : 'classify',
          displayName: 'General'
        },
        FACE: {
          key        : 'FACE',
          id         : 'detect_faces',
          displayName: 'Face'
        }
      }
    }
  },
  // googleVision: {
  //   apiKey      : process.env.NTFY_CFG_GOOGLE_VISION_API_KEY,
  //   domain      : process.env.NTFY_CFG_GOOGLE_VISION_DOMAIN || 'https://vision.googleapis.com/v1/images:annotate',
  //   clientConfig: {
  //     name       : 'google',
  //     displayName: 'Google Vision',
  //     apiVersion : '1.0',
  //     color      : '#EA4335',
  //     models     : {
  //       LOGO_DETECTION: {
  //         key        : 'LOGO_DETECTION',
  //         id         : 'logo',
  //         displayName: 'Logo'
  //       }
  //     }
  //   }
  // }
  microsoftComputerVision: {
    apiKey      : process.env.NTFY_CFG_MICROSOFT_COMPUTER_VISION_API_KEY,
    domain      : process.env.NTFY_CFG_MICROSOFT_COMPUTER_VISION_DOMAIN || 'https://westus2.api.cognitive.microsoft.com/vision/v2.0',
    clientConfig: {
      name       : 'microsoftComputerVision',
      displayName: 'Microsoft Vision',
      apiVersion : '2.0',
      color      : '#4CAF50',
      models     : {
        TAG: {
          key        : 'TAG',
          id         : 'tags',
          displayName: 'Tags'
        }
      }
    }
  }
};
