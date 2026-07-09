import { Button, View } from 'react-native';

// Import the variable
// If this fails, it means you haven't created the file from the example yet!
import { API_BASE_URL } from './src/config/ApiConfig';

const App = () => {
  const getData = async () => {
    try {
      // Use the imported variable
      const response = await fetch(`${API_BASE_URL}/data`);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Connection failed to:", API_BASE_URL);
    }
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Button title="Test Connection" onPress={getData} />
    </View>
  );
};

export default App;