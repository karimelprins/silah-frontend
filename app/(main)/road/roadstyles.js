



import { StyleSheet, Dimensions } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = 100;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#919D7A',
    },
    header: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: HEADER_HEIGHT,
        paddingHorizontal: 15,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: '#4A3B2F',
    },
    headerSideContainer: {
        flex: 1, 
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 2, 
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F5E6D3',
        textAlign: 'center',
    },
    verticalButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerButton: {
        width: 80,
        paddingVertical: 4,
        backgroundColor: '#F5E6D3',
        borderRadius: 6,
        marginVertical: 2,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 10,
        color: '#4A3B2F',
        fontWeight: '700',
    },
    parallaxBackgroundContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
    },
    roadSegment: {
        width: '80%', 
    },
    foregroundContainer: {
        flex: 1,
    },
    scrollContent: {
        width: '100%',
        paddingTop: 40, 
    },
   timelineCircleContainer: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 90, 
        zIndex: 5,
    },
   dateContainerUnderPin: {
        alignItems: 'center',
        marginTop: -12, 
        paddingHorizontal: 6,
        borderRadius: 4,
    },
   pinDateText: {
       color: '#4A3B2F', 
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18,
    },
    pinDateTextSmall: {
        color: '#7B5E4F', 
        fontSize: 11,
        fontWeight: '700',
    },
    loadButton: {
        backgroundColor: '#442D1C',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    loadButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#E8D1A7',
        borderRadius: 10,
        padding: 20,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#4A3B2F',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
 
    dateLabelBox: {
        backgroundColor: '#F5E6D3', 
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(74, 59, 47, 0.2)', 
        
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default styles;