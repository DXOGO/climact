#!/bin/bash

# Define local and remote paths
LOCAL_DIR="/var/thredds"
REMOTE_DIR="/cesam_tmp"
VM_USER="climact"
VM_HOST="cesam-climact.ua.pt"

# Define the final destination on the VM
FINAL_DIR="/var/thredds"

# Step 1: Copy files from local machine to /cesam_tmp on the VM using rsync
echo "Copying files from $LOCAL_DIR to $VM_USER@$VM_HOST:$REMOTE_DIR..."
rsync -av --progress $LOCAL_DIR/ $VM_USER@$VM_HOST:$REMOTE_DIR/

# Step 2: Move files from /cesam_tmp to /var/thredds on the VM, using sudo to set proper permissions
echo "Moving files from $REMOTE_DIR to $FINAL_DIR on the VM..."
ssh $VM_USER@$VM_HOST "sudo rsync -av --remove-source-files $REMOTE_DIR/ $FINAL_DIR/"

# Step 3: Clear the /cesam_tmp directory on the VM (without deleting the directory itself)
echo "Clearing $REMOTE_DIR directory..."
ssh $VM_USER@$VM_HOST "sudo rm -rf $REMOTE_DIR/*"

echo "Files moved successfully!"
