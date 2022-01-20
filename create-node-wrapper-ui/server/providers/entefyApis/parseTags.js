const _ = require('lodash');
const uuid = require('uuid');

const FACE_TAG_SYNONYMS = require('./faceTagSynonyms');

/**
 * Converts objectTags coming from the AI pipeline to the appropriate format expected by the app.
 *
 * ΝΟΤΕ: currently all confidence thresholds have been disabled so all produced tags are
 * shown in the client.
 *
 * @param {Array} objectTags - array of tag objects with info about local objects in images/videos
 * @param {Array} confidenceTags - array of global tag objects (LEGACY ... will soon be sent as part of objectTags)
 * @param {Object<width, height>} dimensions - dimensions for the image associated with the tags
 * @returns {Object} - object including tags and regions
 */
function parseTags({ objectTags, confidenceTags, dimensions }) {
  const processedTags = [];
  const processedRegions = [];
  const tagsPresent = {};

  processObjectTags(objectTags, processedTags, tagsPresent, processedRegions, dimensions);
  processPlaceTags(confidenceTags, processedTags, tagsPresent);
  processConfidenceTags(confidenceTags, processedTags, tagsPresent);

  return {
    tags   : processedTags,
    regions: processedRegions
  };
}

/**
 * Process the object tags for the response
 *
 * @param {Object|Object[]} objectTags - the list of object tags to parse
 * @param {Object[]} processedTags - the list of processed tags
 * @param {Object} tagsPresent - an array of found tags
 * @param {String[]} processedRegions - the list of processed regions
 * @param {Object<width, height>} dimensions - dimensions for the image associated with the tags
 */
function processObjectTags(objectTags, processedTags, tagsPresent, processedRegions, dimensions) {
  _.forEach(objectTags, function(tagObj) {
    const tags = [];

    // Handle face tags separately as they contain special descriptors in the item field of the tagObj
    if (isFaceTag(tagObj)) {
      const faceTags = processFaceTags({
        tag       : 'face.n.01',
        confidence: tagObj.confidence,
        item      : tagObj.item
      });


      tags.push(...faceTags);
    }

    const innerTags = _.isArray(tagObj.tags) ? tagObj.tags : [tagObj.tag];

    _.forEach(innerTags, function(innerTagObj) {
      tagsPresent[innerTagObj.tag] = innerTagObj.confidence;
      if (!_.includes(tags, innerTagObj.tag)
//          && innerTagObj.confidence > esConstants.MIN_OBJECT_TAG_CONFIDENCE
      ) {
        tags.push({
          name : innerTagObj.tag,
          value: innerTagObj.confidence
        });
      }
    });

    // There *probably* used to be an array of colors inside each tagObj
    // but currently it's at tagObj.item.global.colors
    const colorObjects = _.isArray(tagObj.colors) ? tagObj.colors : _.get(tagObj, 'item.global.colors');

    if (_.isArray(colorObjects)) {
      let bestColorArea = _.maxBy(colorObjects, function(colorObj) {
        return colorObj.confidence;
      });

      if (bestColorArea) {
        bestColorArea = bestColorArea.confidence;

        _.forEach(colorObjects, function(colorObj) {
//            if (colorObj.confidence / bestColorArea > esConstants.MIN_COLOR_RELATIVE_AREA) {
          tags.push({
            name : colorObj.tag,
            value: colorObj.confidence
          });
//            }
        });
      }
    }

    if (tags.length > 0) {
      const region = createRegion(tagObj, tags, dimensions);
      if (region) {
        processedRegions.push(region);
      } else {
        processedTags.push(...tags);
      }
    }
  });
}

/**
 * Process the confidence tags for the response
 *
 * @param {Object|Object[]} confidenceTags - the list of confidence tags to parse
 * @param {Object[]} processedTags - the list of processed tags
 * @param {Object} tagsPresent - an array of found tags
 */
function processConfidenceTags(confidenceTags, processedTags, tagsPresent) {
  const filteredConfidenceTags = _(confidenceTags)
    .filter((tagObj) => {
      return !tagObj.isPlace; //&& tagObj.confidence > esConstants.MIN_GLOBAL_TAG_CONFIDENCE;
    })
    .value();

  _.forEach(filteredConfidenceTags, function(tagObj) {
    if (tagObj.confidence > _.get(tagsPresent, tagObj.tag, 0)) {
      processedTags.push({
        name : tagObj.tag,
        value: tagObj.confidence
      });
    }
  });
}

/**
 * Process the confidence place tags for the response
 *
 * @param {Object|Object[]} confidenceTags - the list of confidence place tags to parse
 * @param {Object[]} processedTags - the list of processed tags
 * @param {Object} tagsPresent - an array of found tags
 */
function processPlaceTags(confidenceTags, processedTags, tagsPresent) {
  const placeTags = _(confidenceTags)
    .filter((tagObj) => {
      if (tagObj.isPlace) {
        return true; //tagObj.confidence >= esConstants.MIN_PLACE_TAG_CONFIDENCE;
      }
    })
    .value();

  _.forEach(placeTags, function(tagObj) {
    if (tagObj.confidence > _.get(tagsPresent, tagObj.tag, 0)) {
      processedTags.push({
        name : tagObj.tag,
        value: tagObj.confidence
      });
    }
  });
}

/**
 * Process the face tags included in the tag object.
 *
 * @param {Object} tagObj
 * @returns {Array}
 */
function processFaceTags(tagObj) {
  const faceTags = [];

  _.forEach(FACE_TAG_SYNONYMS, function(synsObj, category) {
    let faceTagConfidence = 0;

    const tags = _(tagObj.item.faces[category])
      .filter(function(obj) {
        if (obj.confidence > faceTagConfidence) {
          faceTagConfidence = obj.confidence;
        }

        return true; //obj.confidence >= esConstants.FACE_ATTRIBUTES_MIN_CONFIDENCE[category];
      })
      .map(function(obj) {
        return synsObj[obj.tag];
      })
      .compact()
      .value();

    if (tags.length === 0) {
      return;
    }

    _.forEach(tags, function(tObj) {
      _.forEach(tObj.nouns, function(noun) {
        faceTags.push({
          name : noun,
          value: faceTagConfidence
        });
      });

      _.forEach(tObj.adjectives, function(adjective) {
        faceTags.push({
          name : adjective,
          value: faceTagConfidence
        });
      });
    });

  });

  _.forEach(tagObj.item.faces.celebrity, function(celebObj) {
//    if (celebObj.confidence >= esConstants.FACE_ATTRIBUTES_MIN_CONFIDENCE.celebrity) {
      faceTags.push({
//        tags       : ['person.n.01', celebObj.tag],
        name : celebObj.tag,
        value: celebObj.confidence
      });
//    }
  });

  faceTags.push({
    name : 'person.n.01',
    value: tagObj.confidence
  });

  return faceTags;
}

/**
 * Creates a new region for the specified tag if applicable, otherwise returns null
 *
 * @param {Object} rawTag - the non-parsed tag object in the response
 * @param {Object[]} parsedTags - the list of parsed tags
 * @param {Object<width, height>} dimensions - dimensions for the image associated with the tags
 * @returns {null|Object}
 */
function createRegion(rawTag, parsedTags, dimensions) {
  if (_.has(rawTag, 'left') && _.has(rawTag, 'right') && _.has(rawTag, 'top') && _.has(rawTag, 'bottom')) {
    return {
      id    : uuid(),
      coords: {
        left_col  : rawTag.left / dimensions.width,
        right_col : rawTag.right  / dimensions.width,
        bottom_row: rawTag.bottom  / dimensions.height,
        top_row   : rawTag.top / dimensions.height
      },
      tags: parsedTags
    };
  }

  return null;
}

/**
 * Helper function to determine whether an objectTag object is a face tag object.
 *
 * @param {Object} tagObj
 * @return {Boolean}
 */
function isFaceTag(tagObj) {
  return _.get(tagObj, 'item.faces.age.length', 0) > 0 ||
    _.get(tagObj, 'item.faces.gender.length', 0) > 0 ||
    _.get(tagObj, 'item.faces.emotions.length', 0) > 0 ||
    _.get(tagObj, 'item.faces.celebrity.length', 0) > 0;
}

module.exports = parseTags;
