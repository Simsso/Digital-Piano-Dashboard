# Installing [node-midi](https://github.com/justinlatimer/node-midi) on Raspberry Pi

## Links
* https://www.raspberrypi.org/forums/viewtopic.php?t=7663
* http://blog.scphillips.com/posts/2013/01/sound-configuration-on-raspberry-pi-with-alsa/

## Commands
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential
sudo apt-get install alsa-utils
sudo apt-get install libasound2-dev
python --version
node --version
npm install midi
nano /home/pi/.asoundrc
sudo apt-get install alsa-utils
sudo apt-get install mpg321
sudo modprobe snd_bcm2835
sudo lsmod | grep 2835
sudo lsmod
sudo amixer cset numid=3 1
alsamixer
npm i midi
```

## Files
### .asoundrc
```
defaults.pcm.card 1
defaults.pcm.device 0
defaults.ctl.card 1
```