import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAYER_COLLECTION } from '@storage/storageConfig';

import { getPlayersByGroup } from './getPlayersByGroup';
import { PlayerStorageDTO } from './PlayerStorageDTO';

export async function removePlayerByGroup(playerName: string, group: string){
    try {
        const storage = await getPlayersByGroup(group);

        const playersFiltered: PlayerStorageDTO[] = storage.filter(player => player.name !== playerName);

        const players = JSON.stringify(playersFiltered);

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players);

    } catch (error) {
        throw error;
    }
}