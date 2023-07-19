import { Button } from '@components/Button';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';
import { useNavigation, useRoute } from '@react-navigation/native';
import { removeGroupByName } from '@storage/group/removeGroupByName';
import { addPlayerByGroup } from '@storage/player/addPlayerByGroup';
import { getPlayersByGroupAndTeam } from '@storage/player/getPlayersByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { removePlayerByGroup } from '@storage/player/removePlayerByGroup';
import { AppError } from '@utils/AppError';
import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';

import { PlayerCard } from './PlayerCard';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
    group: string
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setnewPlayerName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (!newPlayerName.trim().length) {
            return Alert.alert('Novo jogador', 'Informe o nome do jogador para adicionar.')
        }

        const newPlayer = {
            name: newPlayerName,
            team: selectedTeam
        }

        try {
            await addPlayerByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            setnewPlayerName('');

            bindPlayersByGroupAndTeam();
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Novo Jogador', error.message);
            } else {
                Alert.alert('Novo Jogador', 'Não foi possível criar um novo jogador.');
            }
        }
    }

    async function handleRemovePlayer(playerName: string) {
        try {
            await removePlayerByGroup(playerName, group);


            bindPlayersByGroupAndTeam();
        } catch (error) {
            Alert.alert('Remover Jogador', 'Não foi possível remover o jogador.');
        }
    }

    async function bindPlayersByGroupAndTeam() {
        try {
            setIsLoading(true);

            const playersByTeam = await getPlayersByGroupAndTeam(group, selectedTeam);

            setPlayers(playersByTeam);
        } catch (error) {
            Alert.alert('Listagem', 'Não foi possível carregar os jogadores.');
        } finally {
			setIsLoading(false);
		}
    }

    async function removeGroup() {
        try {
            await removeGroupByName(group);
            navigation.navigate('groups');

        } catch (error) {
            console.log(error);
            Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
        }
    }

    async function handleRemoveGroup() {
        Alert.alert(
            'Remover',
            'Deseja remover o grupo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => removeGroup() }
            ]
        )
    }

    useEffect(() => {
        bindPlayersByGroupAndTeam();
    }, [selectedTeam]);

    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    value={newPlayerName}
                    onChangeText={setnewPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === selectedTeam}
                            onPress={() => setSelectedTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {isLoading ? <Loading /> :
                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handleRemovePlayer(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (<ListEmpty message="Não há pessoas nesse time" />)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
                />
            }

            <Button
                title="Remover Turma"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />
        </Container>
    );
}