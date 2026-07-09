import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6C8",
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D8C4A8",
    backgroundColor: "#7A4A2E",
    paddingTop: 40,      
    paddingBottom: 5,
  },

  headerSideContainer: {
    flex: 1, 
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  headerCenterContainer: {
    flex: 3, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F5E6D3",
    textAlign: 'center',
  },

  headerSubtitle: {
    fontSize: 18,
    color: "#D8C4A8",
    marginTop: 4,
    textAlign: 'center',
  },

  messagesContainer: {
    padding: 16,
    backgroundColor: 'transparent', 
  },

  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  aiBubble: {
    backgroundColor: "#8B5A2B",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },

  userBubble: {
    backgroundColor: "#EFE1C4",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },

  aiText: {
    color: "#fff",
    fontSize: 15,
  },

  userText: {
    color: "#5A3A1E",
    fontSize: 15,
  },

  messageText: {
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15, 
    
    backgroundColor: "#F5E6C8",
    alignItems: 'center',
  },

  textInput: {
    flex: 1,
    backgroundColor: "#FFF6E8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#5A3A1E",
  },

  sendButton: {
    backgroundColor: "#8B5A2B",
    borderRadius: 20,
    width: 45,
    height: 45,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  micButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EFE1C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  messageActions: {
    flexDirection: 'row',
    marginTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#D4C3A3',
    paddingTop: 5,
  },

  actionIcon: {
    marginRight: 12,
  },
});

export default styles;