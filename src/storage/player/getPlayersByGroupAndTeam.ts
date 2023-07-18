import { getPlayersByGroup } from './getPlayersByGroup';
import { PlayerStorageDTO } from './PlayerStorageDTO';

export async function getPlayersByGroupAndTeam(group: string, team: string){
    try {
        const storage = await getPlayersByGroup(group);

        const players: PlayerStorageDTO[] = storage.filter(player => player.team === team);

        return players;
    } catch (error) {
        throw error;
    }
}