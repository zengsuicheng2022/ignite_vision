import React, { FC, useEffect } from "react"
import * as Application from "expo-application"
import { Linking, Platform, TextStyle, View, ViewStyle, StyleSheet } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { Camera, Templates, useCameraDevice, useCameraFormat }  from 'react-native-vision-camera'
function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const DemoDebugScreen: FC<DemoTabScreenProps<"DemoDebug">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { videoStabilizationMode: 'cinematic-extended' }
  ])
  // const format = useCameraFormat(device, Templates.Snapchat);
  // const fps = format.maxFps >= 240 ? 240 : format.maxFps;

  useEffect(() => {
    const cameraPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log("=-=cameraPermission", cameraPermission);
      await Camera.requestCameraPermission();
    };
    cameraPermissions();
  }, []);

  const usingHermes = typeof HermesInternal === "object" && HermesInternal !== null
  // @ts-expect-error
  const usingFabric = global.nativeFabricUIManager != null

  const demoReactotron = React.useMemo(
    () => async () => {
      if (__DEV__) {
        console.tron.display({
          name: "DISPLAY",
          value: {
            appId: Application.applicationId,
            appName: Application.applicationName,
            appVersion: Application.nativeApplicationVersion,
            appBuildVersion: Application.nativeBuildVersion,
            hermesEnabled: usingHermes,
          },
          important: true,
        })
      }
    },
    [],
  )

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      { device &&
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            format={format}
            // fps={fps}
            isActive={true}
            photo={true}
            exposure={20}
          />
        }      
      <Text style={$title} preset="heading" tx="demoDebugScreen.title" />      
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
  height: "100%"
}

const $absolutefill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.lg,
  alignSelf: isRTL ? "flex-start" : "flex-end",
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const $hint: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 12,
  lineHeight: 15,
  paddingBottom: spacing.lg,
}
