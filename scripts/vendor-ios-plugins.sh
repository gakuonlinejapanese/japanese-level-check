#!/bin/sh
# Copies the iOS (Swift) parts of the Capacitor plugins into ios/vendor so the iOS
# project opens in Xcode without node_modules, and points CapApp-SPM at those copies.
# Run after `npx cap sync ios`.
set -e
cd "$(dirname "$0")/.."
rm -rf ios/vendor
for entry in "splash-screen:@capacitor/splash-screen" "status-bar:@capacitor/status-bar" \
             "purchases-capacitor:@revenuecat/purchases-capacitor" \
             "speech-recognition:@capacitor-community/speech-recognition"; do
  name="${entry%%:*}"; pkg="${entry#*:}"
  mkdir -p "ios/vendor/$name"
  cp "node_modules/$pkg/Package.swift" "ios/vendor/$name/"
  cp -R "node_modules/$pkg/ios" "ios/vendor/$name/"
  sed -i.bak "s#\.\./\.\./\.\./node_modules/$pkg#../../vendor/$name#" ios/App/CapApp-SPM/Package.swift
done
rm -f ios/App/CapApp-SPM/Package.swift.bak
