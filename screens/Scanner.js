import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Button } from "react-native";
import { Camera } from "expo-camera";

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(data);
  };

  const toggleFlash = async () => {
    console.log("nil");
    if (hasPermission) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log(status);
      if (status === "granted") {
        setFlashOn((prev) => !prev);
      } else {
        alert("Camera permission is required to toggle the flashlight.");
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        torchMode={
          flashOn
            ? Camera.Constants.FlashMode.torch
            : Camera.Constants.FlashMode.off
        }
      />

      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
        <Text style={styles.flashButtonText}>
          {flashOn ? "Turn Flash Off" : "Turn Flash On"}
        </Text>
      </TouchableOpacity>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const overlayColor = "rgba(0,0,0,0.5)";
const borderColor = "#FFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  flashButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 5,
  },
  flashButtonText: {
    color: "white",
  },
});

export default Scanner;
