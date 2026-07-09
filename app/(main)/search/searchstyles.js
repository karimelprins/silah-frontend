import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6C8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D8C4A8",
    backgroundColor: "#7A4A2E",
    paddingTop: 35,
    paddingBottom: 5,
  },
  headerSideContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerCenterContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F5E6D3",
    textAlign: "center",
    //marginBottom:5
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#D8C4A8",
    marginTop: 4,
    textAlign: "center",
  },

  photoSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: "#F2E8D8",
    width: "100%",
    paddingVertical: 25,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4C3A3",
    borderStyle: "dashed",
    marginBottom: 15,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#795548",
    marginTop: 8,
  },
  uploadSubtitle: { fontSize: 12, color: "#9B7B5C", textAlign: "center" },

  previewContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginVertical: 24,
  },
  photoPreview: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: "#E7DED0",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  searchButton: {
    backgroundColor: "#7A4A2E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
  },
  searchButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },

  personCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  personName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5D4037",
    marginBottom: 5,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  infoDetail: { fontSize: 16, color: "#795548" },
  roadmapHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8D6E63",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },

  roadmapItem: { flexDirection: "row", marginHorizontal: 25 },
  timelineLeft: { alignItems: "center", width: 20 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8D6E63",
    zIndex: 1,
  },
  timelineLine: { width: 2, flex: 1, backgroundColor: "#D7CCC8" },
  memoryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    marginLeft: 15,
    marginBottom: 20,
    padding: 12,
    borderRadius: 15,
    elevation: 1,
  },

  memoryDescription: {
    fontSize: 14,
    color: "#5D4037",
    marginTop: 4,
  },

  memoryAuthor: {
    fontSize: 12,
    color: "#8D6E63",
    marginTop: 6,
    fontStyle: "italic",
    textAlign: "right",
  },

  memoryThumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 8,
  },
  memoryDate: { fontSize: 12, color: "#8D6E63", fontWeight: "bold" },
  memoryTitle: { fontSize: 16, color: "#3E2723" },
  noRecognition: {
    textAlign: "center",
    marginTop: 30,
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "600",
  },
});
