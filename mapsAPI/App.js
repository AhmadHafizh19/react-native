import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

export default function App() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://storage.googleapis.com/disaster-shield/heatmapData.json');
      const data = response.data;

      const heatmapResponse = await axios.post('https://model-fastapi-frlemfld5q-et.a.run.app/predict', { data });

      const heatmapData = heatmapResponse.data.heatmap;
      setHeatmapData(heatmapData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          html: `
            <html>
              <head>
                <style>
                  html, body, #map {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                  }
                </style>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFVqoYS94ZB5T5F52_MXKyDdl3OZ-YrKg"></script>
                <script>
                  function createHeatmap(heatmapData) {
                    const map = new google.maps.Map(document.getElementById('map'), {
                      center: { lat: -6.1754, lng: 106.8272 },
                      zoom: 10
                    });

                    const heatmap = new google.maps.visualization.HeatmapLayer({
                      data: heatmapData,
                      map: map
                    });

                    heatmap.setMap(map);
                  }

                  document.addEventListener('DOMContentLoaded', () => {
                    createHeatmap(${JSON.stringify(heatmapData)});
                  });
                </script>
              </head>
              <body>
                <div id="map"></div>
              </body>
            </html>
          `,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
