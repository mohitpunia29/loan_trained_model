import {
  forEach as _forEach,
  map as _map
} from 'lodash';

/**
 * Parse the propTypesSchema, in order to generate the configuration
 * It will map the props to predefined components
 *
 * @param {Object} schema
 */
export default function parsePropTypesSchema(schema) {
  const { fields, required } = recursivelyParsePropTypesSchema(schema);

  const finalFields = Array.from(fields.values());
  const displayNames = getDisplayNames(_map(finalFields, 'path'));
  for (let i = 0; i < displayNames.length; i++) {
    if (!finalFields[i].displayName) {
      finalFields[i].displayName = displayNames[i];
    } else {
      // regex to replace the last part of the name by the prop.displayName
      finalFields[i].displayName = displayNames[i].replace(/^(.*?)\.?([^.]+)$/, '$1' + finalFields[i].displayName);
    }
  }

  return {
    fields: finalFields,
    required
  };
}

function recursivelyParsePropTypesSchema(schema, pathPrefix = '', additionalProps = {}) {
  const fields = new Map();
  const required = [];
  // console.log('###', pathPrefix, schema.type, { schema, pathPrefix });

  if (schema.type === 'array') {
    // console.log('array');
    return recursivelyParsePropTypesSchema(schema.items, pathPrefix, {
      multiple     : true,
      exactItemsRef: schema.exactItemsRef,
      minItems     : schema.minItems,
      maxItems     : schema.maxItems
    });
  } else if (schema.type === 'object') { // eslint-disable-line no-else-return
    // console.log('object');
    if (!schema.properties) {
      fields.set(pathPrefix, generateField(schema, pathPrefix, additionalProps));
    } else {
      _forEach(schema.properties, (prop, key) => {
        if (prop.required) {
          required.push(..._map(prop.required, requiredKey => prefixPath(requiredKey, prefixPath(key, pathPrefix))));
        }

        const {
          fields: subFields,
          required: subRequired
        } = recursivelyParsePropTypesSchema(prop, prefixPath(key, pathPrefix));

        // merge subFields into fields
        Array.from(subFields).map((val) => {
          fields.set(...val);
        });
        required.push(...subRequired);

        // set isRequired
        for (const [fieldKey, fieldValue] of fields.entries()) {
          fields.set(fieldKey, {
            ...fieldValue,
            isRequired: required.indexOf(fieldKey) !== -1
          });
        }
      });
    }
  } else {
    // console.log('primitive');
    fields.set(pathPrefix, generateField(schema, pathPrefix, additionalProps));
  }

  // console.log('----', { fields, required });

  return {
    fields,
    required
  };
}

function prefixPath(path, prefix) {
  return prefix ? `${prefix}.${path}` : path;
}

function generateField(prop, path, additionalProps) {
  // console.log('+++', prop.source, path, prop);
  const field = {
    ...additionalProps,
    path,
    name       : path.split('.').pop(),
    sourceType : prop.sourceType || prop.type,
    displayName: prop.displayName,
    description: prop.description
  };

  switch (prop.source || prop.type) {
    case 'data':
      field.type = 'data';
      break;
    case 'column':
      field.type = 'csvColumn';
      break;
    case 'enum':
      field.type = 'enum';
      field.enumValues = prop.enum;
      break;
    case 'colorPicker':
      field.type = 'colorPicker';
      break;
    case 'input':
      field.type = 'input';
      break;
    case 'boolean':
      field.type = 'boolean';
      break;
    default:
      return undefined;
  }

  return field;
}

/**
 * Create the display names, ensuring that we do not have conflicts
 *
 * @param  {String[]} collection
 * @return {String[]}
 */
function getDisplayNames(collection) {
  const returnFieldNames = [];

  const uniqueFieldNamesArray = (a, b) => {
    const aList = (a || '').split('.').reverse();
    const bList = (b || '').split('.').reverse();

    const uniqueSubNames = [];
    aList.some((subName, index) => {
      uniqueSubNames.unshift(subName);
      return subName !== bList[index];
    });

    return uniqueSubNames;
  };

  collection.forEach((field, index) => {
    let fieldName = [];
    for (let i = 0; i < collection.length; i++) {
      if (index !== i) {
        const tempFieldName = uniqueFieldNamesArray(field, collection[i]);
        fieldName = tempFieldName.length > fieldName.length ? tempFieldName : fieldName;
      }
    }
    returnFieldNames.push(fieldName.join('.'));
  });

  return returnFieldNames;
}
