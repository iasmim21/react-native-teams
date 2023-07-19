import { UsersThree } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.GRAY_600};
    padding: 24px;
`;

export const Content = styled(SafeAreaView)`
    flex: 1;
    justify-content: center;
`;

export const Icon = styled(UsersThree).attrs(({ theme }) => ({
    color: theme.COLORS.GREEN_700,
    size: 56,
}))`
    align-self: center;
`;