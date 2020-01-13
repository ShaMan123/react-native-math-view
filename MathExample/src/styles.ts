
import { StyleSheet, I18nManager } from 'react-native';

export default StyleSheet.create({
    flexContainer: {
        //flex: 1,
        display: 'flex',
        flexDirection: 'row',
        //flexWrap: 'wrap',
        //justifyContent: 'center',
        //alignItems: 'center',
        margin: 5

    },
    flexWrapContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: 5,
        elevation: 2,
        paddingHorizontal: 5,
        backgroundColor: 'pink',
        borderRadius: 50
    },
    sectionHeader: {
        backgroundColor: 'blue',
        color: 'white',
        flex: 1,
        elevation: 5,
        textAlign: 'left',//I18nManager.isRTL ? 'right' : 'left'
        minWidth: '100%'
    },
    default: {
        flex: 1
    },
    defaultColorTheme: {
        backgroundColor: 'blue',
        color: 'white'
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexLeft: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
    },
    diverseContainer: {
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        marginVertical: 10
    },
    inlineContainer: {
        display: 'flex',
        flexDirection: 'row',
        //alignItems: 'center'
        //alignItems: 'flex-start'
    }
});