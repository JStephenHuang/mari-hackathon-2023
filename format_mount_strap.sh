# !/bin/bash

device="/dev/$1"
hostname="$2"
password="$3"
echo "n
p
1



w" | fdisk $device

echo "y
" | mkfs.ext4 ${device}1

location="/mnt/$1"
mkdir $location
mount ${device}1 $location

pacstrap -K $location base linux linux-firmware arch-install-scripts docker networkmanager

genfstab -U $location > $location/etc/fstab

arch-chroot $location ln -sf /etc/share/zoneinfo/Canada/Eastern /etc/localtime
arch-chroot $location hwclock --systohc
arch-chroot $location echo "LANG=en_US.UTF-8" > /etc/locale.conf

arch-chroot $location echo "$hostname" > /etc/hostname
arch-chroot $location mkinitcpio -P 
#echo "$password\n$password\n" | arch-chroot $location passwd

arch-chroot $location pacman --noconfirm -S grub
arch-chroot $location grub-install --target=i386-pc $device

arch-chroot $location grub-mkconfig -o /boot/grub/grub.cfg

arch-chroot $location

