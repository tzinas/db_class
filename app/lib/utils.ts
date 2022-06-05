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

export const fetcher = async url => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = {
      info: await res.json(),
      status: res.status
    }
    throw error
  }
  return res.json()
}
