import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F3EE',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#4C2A13",
      
      
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "#FFF",
        textAlign: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 120, 
    },
    reminderCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 6,
        borderLeftColor: '#B4A594',
    },
    urgentCard: {
        borderLeftColor: '#d32f2f',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4C2A13',
        flex: 1,
    },
    urgentBadge: {
        backgroundColor: '#ffebee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    urgentText: {
        color: '#d32f2f',
        fontSize: 12,
        fontWeight: 'bold',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reminderDate: {
        fontSize: 14,
        color: '#8A7B6A',
        marginLeft: 6,
    },
    reminderDescription: {
        fontSize: 15,
        color: '#4C2A13',
        lineHeight: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 110,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#7A4A2E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#FDFBFA',
        borderRadius: 25,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4C2A13',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A7B6A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7F3EE',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#4C2A13',
        borderWidth: 1,
        borderColor: '#EFE1C4',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    typeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFE1C4',
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#FFF',
    },
    activeTypeButton: {
        backgroundColor: '#7A4A2E',
        borderColor: '#7A4A2E',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A7B6A',
    },
    activeTypeText: {
        color: '#FFF',
    },
    modalActions: {
        flexDirection: 'row',
        marginTop: 25,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        backgroundColor: '#EFE1C4',
        marginRight: 10,
        alignItems: 'center',
    },
    submitBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 12,
        backgroundColor: '#7A4A2E',
        alignItems: 'center',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4C2A13',
    },
    submitBtnText: {
        color: '#FFF',
    },
   
    actionButtons: {
        flexDirection: 'row',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F7F3EE',
        paddingTop: 10,
        justifyContent: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        padding: 5,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    editBtn: {
        color: '#7A4A2E',
    },
    deleteBtn: {
        color: '#d32f2f',
    },
});
