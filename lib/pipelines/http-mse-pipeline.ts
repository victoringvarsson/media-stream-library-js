import { Pipeline } from './pipeline'
import { HttpSource, HttpConfig } from '../components/http-source'
import { MseSink } from '../components/mse'
import { Mp4Parser } from '../components/mp4-parser'

export interface HttpMseConfig {
  http: HttpConfig
  mediaElement: HTMLVideoElement
}

export class HttpMsePipeline extends Pipeline {
  public http: HttpSource

  private _src?: HttpSource
  private _sink: MseSink

  constructor(config: HttpMseConfig) {
    const { http: httpConfig, mediaElement } = config

    const httpSource = new HttpSource(httpConfig)
    const mp4Parser = new Mp4Parser()
    const mseSink = new MseSink(mediaElement)

    super(httpSource, mp4Parser, mseSink)

    this._src = httpSource
    this._sink = mseSink

    // Expose session for external use
    this.http = httpSource
  }

  close() {
    this._src && this._src.abort()
  }

  get currentTime() {
    return this._sink.currentTime
  }

  play() {
    return this._sink.play()
  }

  pause() {
    return this._sink.pause()
  }
}
