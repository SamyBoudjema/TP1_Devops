import { generateNewTeaId, getTeaByName, saveTea } from './saver.js'

/**
 * create an new tea. If the tea name already exists, it will be updated instead
 * @import {Tea} from './saver.js'
 * @param {Omit<Tea, 'id'>} teaDto
 * @returns {{success: boolean}}
 */
export function addTea(teaDto) {
  const existingTea = getTeaByName(teaDto.name)

  const teaToCreate = {
    ...teaDto,
    id: existingTea ? existingTea.id : generateNewTeaId(),
  }

  try {
    saveTea(teaToCreate)
  } catch (e) {
    console.error(e)
    return {
      success: false,
    }
  }

  return {
    success: true,
  }
}