import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
        textAlign: 'center',
    },
    contentText: {
        color: theme.colors.text,
        fontSize: 16,
        lineHeight: 24,
        marginTop: 48,
    },
});