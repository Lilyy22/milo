#!/bin/bash
set -e

yarn run build

echo "Export SWA build"
rm -rf .next/standalone/src

# Use absolute paths for copying
BUILD_DIR=$(pwd)
TARGET_DIR="$BUILD_DIR/site/wwwroot"

# Remove old files from target directory
echo "Remove old files from target directory"
rm -rf $TARGET_DIR/*

# Copy necessary files and directories
echo "Copy static"
mkdir -p $BUILD_DIR/.next/standalone/.next/static
cp -r $BUILD_DIR/.next/static $BUILD_DIR/.next/standalone/.next

echo "Copy public"
mkdir -p $BUILD_DIR/.next/standalone/public
cp -r $BUILD_DIR/public $BUILD_DIR/.next/standalone

echo "Copy prisma"
cp -r $BUILD_DIR/prisma $BUILD_DIR/.next/standalone

echo "Copy ecosystem.config.js"
cp $BUILD_DIR/ecosystem.config.js $BUILD_DIR/.next/standalone

echo "List contents of .next/standalone"
ls -alF $BUILD_DIR/.next/standalone

echo ".next/standalone size"
du -sh $BUILD_DIR/.next/standalone

echo ".next/standalone/* size"
du -sh $BUILD_DIR/.next/standalone/*

# Ensure the target directory exists
echo "Ensure target directory exists"
mkdir -p $TARGET_DIR

# Copy all standalone content to wwwroot
echo "Copy all standalone content to wwwroot"
cp -r $BUILD_DIR/.next/standalone/* $TARGET_DIR

# List files in site/wwwroot to verify
echo "List contents of $TARGET_DIR"
ls -alF $TARGET_DIR
echo "List contents of $TARGET_DIR/prisma"
ls -alF $TARGET_DIR/prisma

echo "$TARGET_DIR size"
du -sh $TARGET_DIR

echo "$TARGET_DIR/* size"
du -sh $TARGET_DIR/*

# Check if schema.prisma exists
echo "Checking contents of $TARGET_DIR/prisma"
ls -al $TARGET_DIR/prisma

echo "Checking if schema.prisma exists"
if [ -f $TARGET_DIR/prisma/schema.prisma ]; then
  echo "schema.prisma found"
else
  echo "schema.prisma not found"
fi
