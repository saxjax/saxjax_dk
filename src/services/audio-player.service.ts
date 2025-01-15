import { Injectable } from '@angular/core';
import { Path } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audioCtx: AudioContext;
  private gainNode: GainNode; //= this.audioCtx.createGain();
  playbackRate = 1;

  constructor() {
    this.audioCtx = new window.AudioContext();
    this.gainNode = this.audioCtx.createGain();
  }

async getFile(audioContext:AudioContext, filepath:string) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

  async  setupSample(path:string = '../assets/audio/merserburger_sauberspruche.mp3') {
// sourcery skip: inline-immediately-returned-variable
  const sample = await this.getFile(this.audioCtx, path);
  return sample;
  }

  async playSample(path:string, time: number = 1) {
    const audioContext = this.audioCtx;
    const audioBuffer = await this.setupSample(path);
    const sampleSource = new AudioBufferSourceNode(audioContext, {
      buffer: audioBuffer,
      playbackRate: this.playbackRate,
  });
  sampleSource.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
  }


}
