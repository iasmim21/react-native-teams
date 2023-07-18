import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';

import { getPlayersByGroup } from './getPlayersByGroup';
import { PlayerStorageDTO } from './PlayerStorageDTO';

export async function addPlayerByGroup(newPlayer: PlayerStorageDTO, group: string) {
    try {
        const storedPlayers= await getPlayersByGroup(group);

        const playerAlreadyExists = storedPlayers.filter(
            player => player.name == newPlayer.name
        );

        if(playerAlreadyExists.length) {
            throw new AppError('Já existe um jogador cadastrado com esse nome.');
        }

        const storage = JSON.stringify([...storedPlayers, newPlayer]);

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
    } catch (error) {
        throw error;
    }
}