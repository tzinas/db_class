import _ from 'lodash'

export const unchangableAttributes = {
  all: ['id'],
  project: ['duration']
}

export const removeUnchangableAttributes = (data, entity) => {
  const changedData = _.clone(data)

  unchangableAttributes.all.forEach(attribute => {
    if (changedData.hasOwnProperty(attribute)) {
      delete changedData[attribute]
    }
  })

  if (!unchangableAttributes.hasOwnProperty(entity)) {
    return changedData
  }

  unchangableAttributes[entity].forEach(attribute => {
    if (changedData.hasOwnProperty(attribute)) {
      delete changedData[attribute]
    }
  })

  return changedData
}
