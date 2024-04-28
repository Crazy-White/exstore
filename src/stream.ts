export class StringStreamPeeker {
  private reader: ReadableStreamDefaultReader<string>
  private buffers: string[] = []
  private get buffer() {
    return this.buffers.join('')
  }

  private get bufferLength() {
    return this.buffers.reduce((acc, cur) => acc + cur.length, 0)
  }

  private async tryEnlargeBuffer() {
    const { done, value } = await this.reader.read()

    if (done)
      return false

    this.buffers.push(value)
    return true
  }

  constructor(private stream: ReadableStream<string>) {
    this.reader = stream.getReader()
  }

  public async peek(n = 1) {
    while (this.bufferLength < n) {
      if (!await this.tryEnlargeBuffer())
        throw new Error('Unable to peek due to end of stream')
    }
    return this.buffer.slice(0, n)
  }

  /**
   * Internal state will not change when no enough data is available
   */
  public async consume(n = 1) {
    while (this.bufferLength < n) {
      if (!await this.tryEnlargeBuffer())
        throw new Error('Unable to consume due to end of stream')
    }
    let bLen = 0
    for (let i = 0; i < this.buffers.length; i++) {
      const b = this.buffers[i]
      bLen += b.length

      if (bLen > n) {
        // already read enough chunks, now reduce the first buffer
        this.buffers = this.buffers.slice(i)
        this.buffers[0] = this.buffers[0].slice(bLen - n)
      }
    }
  }

  /**
   * @params token the token (single character) itself will not be consumed
   */
  public async consumeUntil(token: string) {
    if (token.length !== 1)
      throw new TypeError('Token can only be a single character')

    let index: number

    // eslint-disable-next-line no-cond-assign
    while ((index = this.buffer.indexOf(token)) !== -1) {
      if (!await this.tryEnlargeBuffer())
        throw new Error('Unable to consumeUntil due to end of stream')
    }
    const result = this.buffer.slice(0, index)
    this.buffers = [this.buffer.slice(index)]
    return result
  }
}
