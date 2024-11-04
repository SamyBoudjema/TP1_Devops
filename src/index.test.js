// test/index.test.js
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { addTea } from './index.js'
import { getTeaByName, saveTea, generateNewTeaId } from './saver.js'

vi.mock('./saver.js') // Mock saver.js

describe('index.js addTea function', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('should add a new tea if it does not exist', () => {
        const teaDto = { name: 'Thé Blanc', description: 'Un thé blanc' }
        getTeaByName.mockReturnValue(undefined)
        generateNewTeaId.mockReturnValue(1001)

        const result = addTea(teaDto)

        expect(result).toEqual({ success: true })
        expect(getTeaByName).toHaveBeenCalledWith('Thé Blanc')
        expect(generateNewTeaId).toHaveBeenCalled()
        expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 1001 })
    })

    test('should update an existing tea', () => {
        const teaDto = { name: 'Thé Vert', description: 'Thé vert bio' }
        const existingTea = { id: 1000, name: 'Thé Vert', description: 'Un thé vert' }
        getTeaByName.mockReturnValue(existingTea)

        const result = addTea(teaDto)

        expect(result).toEqual({ success: true })
        expect(getTeaByName).toHaveBeenCalledWith('Thé Vert')
        expect(generateNewTeaId).not.toHaveBeenCalled() // No new ID should be generated
        expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: existingTea.id })
    })

    test('should return success: false if saveTea throws an error', () => {
        const teaDto = { name: 'Thé Rouge', description: 'Un thé rouge' }
        getTeaByName.mockReturnValue(undefined)
        generateNewTeaId.mockReturnValue(1002)
        saveTea.mockImplementation(() => {
            throw new Error('Error saving tea')
        })

        const result = addTea(teaDto)

        expect(result).toEqual({ success: false })
        expect(getTeaByName).toHaveBeenCalledWith('Thé Rouge')
        expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 1002 })
    })
})
