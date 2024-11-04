import { describe, test, expect, vi } from 'vitest';
import { getTeaByName, saveTea, generateNewTeaId } from './saver.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Mock du module fs
vi.mock('fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
}));

describe('getTeaByName', () => {
    test('retourne le thé demandé si le fichier existe et le thé est présent', () => {
        // Arrange
        existsSync.mockReturnValue(true);
        readFileSync.mockReturnValue(JSON.stringify([{ id: 1, name: 'Fruit rouges', description: 'Détails...' }]));
        writeFileSync.mockImplementation(() => {});

        // Act
        saveTea({ id: 1, name: 'Fruit rouges', description: 'Détails...' });
        const result = getTeaByName('Fruit rouges');

        // Assert
        expect(result).toEqual({ id: 1, name: 'Fruit rouges', description: 'Détails...' });
    });

    test("retourne undefined si le thé n'est pas présent", () => {
        // Arrange
        existsSync.mockReturnValue(true);
        readFileSync.mockReturnValue(JSON.stringify([{ id: 1, name: 'Thé vert', description: 'Détails...' }]));

        // Act
        const result = getTeaByName('Inconnu');

        // Assert
        expect(result).toBeUndefined();
    });
});

describe('saveTea', () => {
    test('sauvegarde un nouveau thé', () => {
        // Arrange
        readFileSync.mockReturnValue(JSON.stringify([]));
        writeFileSync.mockClear();

        const newTea = { id: 2, name: 'Thé vert', description: 'Un thé classique' };

        // Act
        saveTea(newTea);

        // Assert
        expect(writeFileSync).toHaveBeenCalledWith('data.json', expect.stringContaining('"Thé vert"'));
    });

    test("lance une erreur si le nom du thé n'est pas unique", () => {
        // Arrange
        readFileSync.mockReturnValue(JSON.stringify([{ id: 1, name: 'Fruit rouges', description: 'Un thé fruité' }]));

        // Act & Assert
        const duplicateNameTea = { id: 2, name: 'Fruit rouges', description: 'Duplicata' };
        expect(() => saveTea(duplicateNameTea)).toThrow('Tea with name Fruit rouges already exists');
    });

    test("lance une erreur si l'ID du thé n'est pas unique", () => {
        // Arrange
        readFileSync.mockReturnValue(JSON.stringify([{ id: 1, name: 'Thé vert', description: 'Un thé classique' }]));

        // Act & Assert
        const duplicateIdTea = { id: 1, name: 'Thé noir', description: 'Un thé fort' };
        expect(() => saveTea(duplicateIdTea)).toThrow('Tea with id 1 already exists');
    });
});

describe('generateNewTeaId', () => {
    test('génère un nouvel ID pour le thé', () => {
        //Arrange
        const teas = [{ id: 1, name: 'Thé vert', price: 3 }, { id: 2, name: 'Thé noir', price: 4 }];

        //Act
        const newId = generateNewTeaId();

        //Assert
        expect(newId).toBeGreaterThan(2);
    })

    test('génère un ID de 1 si la liste est vide', () => {
        //Arrange
        const id = Date.now();
        //Act
        const newId = generateNewTeaId();

        //Assert
        expect(newId).toBeGreaterThanOrEqual(id);
    })
})
