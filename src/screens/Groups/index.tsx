import { Button } from '@components/Button';
import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllGroups } from '@storage/group/getAllGroups';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';

import { Container } from './styles';

export function Groups() {
	const [isLoading, setIsLoading] = useState(true);
	const [groups, setGroups] = useState<string[]>([]);

	const navigation = useNavigation();

	function handleNewGroup() {
		navigation.navigate('new');
	}

	function handleOpenGroup(group: string) {
		navigation.navigate('players', { group });
	}

	async function bindGroups() {
		try {
			setIsLoading(true);

			const data = await getAllGroups();

			setGroups(data);
		} catch (error) {
			Alert.alert('Listagem', 'Não foi possível carregar a listagem dos grupos.');
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	useFocusEffect(useCallback(() => {
		bindGroups();
	}, []));

	return (
		<Container>
			<Header />

			<Highlight title="Turmas" subtitle="jogue com a sua turma" />

			{isLoading ? <Loading /> :
				<FlatList
					data={groups}
					keyExtractor={item => item}
					renderItem={({ item }) => (
						<GroupCard
							title={item}
							onPress={() => handleOpenGroup(item)}
						/>
					)}
					contentContainerStyle={!groups.length && { flex: 1 }}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={() => (
						<ListEmpty message="Que tal cadastrar a primeira turma?" />
					)}
				/>
			}

			<Button title="Criar nova turma" onPress={handleNewGroup}></Button>
		</Container>
	);
}