const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("無法初始化著色器程序: " + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
};

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("編譯著色器時發生錯誤: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};
const arrayBufferData = (gl, data, count, classType = Float32Array, usage = gl.STATIC_DRAW) => {
  let _data;
  const buffer = gl.createBuffer();
  let bufferLength = 0;
  const obj = {
    buffer: buffer,
    get data() {
      return _data;
    },
    get length() {
      return _data.length;
    },
    set(data) {
      _data = new classType(data);
      /*gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, _data.length * 4, usage);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);*/
      bufferLength = 100 * Math.ceil(_data.length / count / 100);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferLength * count * 4, usage);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);
    },
    add(data) {
      const len = _data.length;
      /*gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, (len + count) * 4, usage);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);*/
      const tempBufferLength = 100 * Math.floor(_data.length / count / 100);
      if (tempBufferLength >= bufferLength) {
        bufferLength = tempBufferLength + 100;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, bufferLength * count * 4, usage);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);
      }
      const temp = new classType(len + count);
      temp.set(_data);
      _data = temp;
      this.item(len / count, data);
    },
    item(index, data) {
      const temp = new classType(data);
      _data.set(temp, index * count);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, index * count * 4, temp);
    },
    getItem(index) {
      return Array.from(_data.slice(index * count, (index + 1) * count));
    },
  };
  obj.set(data);
  return obj;
};
const elementArrayBufferData = (gl, data, classType = Uint8Array, usage = gl.STATIC_DRAW) => {
  let _data; // = new Uint8Array(data);
  const buffer = gl.createBuffer();
  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _data, usage);
  let bufferLength = 0;
  const count = 3;
  const obj = {
    buffer: buffer,
    get data() {
      return _data;
    },
    get length() {
      return _data.length;
    },
    set(data) {
      _data = new classType(data);
      bufferLength = 100 * Math.ceil(_data.length / count / 100);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferLength * count * 4, usage);
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, _data);
      //console.log(bufferLength, count);
    },
    add(data) {
      const len = _data.length;
      /*gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, (len + count) * 4, usage);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);*/
      const tempBufferLength = 100 * Math.floor(_data.length / count / 100);
      if (tempBufferLength >= bufferLength) {
        bufferLength = tempBufferLength + 100;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferLength * count * 4, usage);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, _data);
      }
      const temp = new classType(len + count);
      temp.set(_data);
      _data = temp;
      this.item(len / count, data);
    },
    item(index, data) {
      const temp = new classType(data);
      _data.set(temp, index * count);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, index * count * 4, temp);
    },
    getItem(index) {
      return Array.from(_data.slice(index * count, (index + 1) * count));
    },
  };
  obj.set(data);
  return obj;
};

/*const arrayBufferData0 = (gl, data, count, usage = gl.STATIC_DRAW) => {
  let _data;
  const buffer = gl.createBuffer();
  const obj = {
    buffer: buffer,
    get data() {
      return _data;
    },
    get length() {
      return _data.length;
    },
    set(data) {
      _data = new Float32Array(1024 * count);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, 1024 * count * 4, usage);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, _data);
    },
    use() {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    },
    item(index, data) {
      const temp = new Float32Array(data);
      _data.set(temp, index * count);
      gl.bufferSubData(gl.ARRAY_BUFFER, index * count * 4, temp);
    },
    zero(index) {
      const temp = new Float32Array((1024 - index) * count);
      _data.set(temp, index * count);
      gl.bufferSubData(gl.ARRAY_BUFFER, index * count * 4, temp);
    },
    getItem(index) {
      return Array.from(_data.slice(index * count, (index + 1) * count));
    },
  };
  obj.set(data);
  return obj;
};*/

const createAndSetupTexture = (gl) => {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
};
const loadTexture = (gl, url) => {
  const texture = createAndSetupTexture(gl);
  const image = new Image();
  image.onload = function () {
    texture.width = image.width;
    texture.height = image.height;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  image.src = url;
  return texture;
};
const setFramebuffer = (gl, fbo, width, height) => {
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  if (width !== undefined && height !== undefined) {
    gl.viewport(0, 0, width, height);
  }
};

const useFramebufferTexture = (gl, framebufferTexture, resize = true) => {
  if (framebufferTexture) {
    if (resize) {
      setFramebuffer(gl, framebufferTexture.framebuffer, framebufferTexture.width, framebufferTexture.height);
    } else {
      setFramebuffer(gl, framebufferTexture.framebuffer);
    }
  } else {
    if (resize) {
      setFramebuffer(gl, null, gl.canvas.width, gl.canvas.height);
    } else {
      setFramebuffer(gl, null);
    }
  }
};
const createFramebufferTexture = (gl, width, height) => {
  const obj = {
    width: width || gl.canvas.clientWidth,
    height: height || gl.canvas.clientHeight,
  };
  const texture = createAndSetupTexture(gl);
  obj.texture = texture;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, obj.width, obj.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const fbo = gl.createFramebuffer();
  obj.framebuffer = fbo;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  /*obj.use = () => {
    setFramebuffer(gl, fbo, obj.width, obj.height);
  };*/
  return obj;
};
const createFramebufferTextures = (gl, n, width, height) => {
  const framebufferTextures = [];
  for (let i = 0; i < n; i++) {
    framebufferTextures.push(createFramebufferTexture(gl, width, height));
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return framebufferTextures;
};

const attribFuns = {
  attribFloat(gl, shaderProgram, name, count) {
    const i = gl.getAttribLocation(shaderProgram, name);
    gl.enableVertexAttribArray(i);
    return (val) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, val);
      gl.vertexAttribPointer(i, count, gl.FLOAT, false, 0, 0);
    };
  },
};
const uniformFuns = {
  uniform1f(gl, shaderProgram, name) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      gl.uniform1f(i, val);
    };
  },
  uniform2fv(gl, shaderProgram, name) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      gl.uniform2fv(i, val);
    };
  },
  uniform3fv(gl, shaderProgram, name) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      gl.uniform3fv(i, val);
    };
  },
  uniformTexture(gl, shaderProgram, name, index) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      //貼圖
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, val);
      gl.uniform1i(i, index);
    };
  },
  uniform1i(gl, shaderProgram, name) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      gl.uniform1i(i, val);
    };
  },
  uniformMatrix4fv(gl, shaderProgram, name) {
    const i = gl.getUniformLocation(shaderProgram, name);
    return (val) => {
      gl.uniformMatrix4fv(i, false, val);
    };
  },
};
const shaderProgramFun = (gl, shader, vs, fs, drawFun) => {
  const programInfo = shader(gl, vs, fs);
  return {
    programInfo: programInfo,
    use() {
      gl.useProgram(programInfo.program);
    },
    attribSet(vals) {
      for (let key in vals) {
        if (programInfo.attribLocations[key]) {
          programInfo.attribLocations[key](vals[key]);
        }
      }
    },
    uniformSet(vals) {
      for (let key in vals) {
        if (programInfo.uniformLocations[key]) {
          programInfo.uniformLocations[key](vals[key]);
        }
      }
    },
    elementSet(val) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, val);
    },
  };
};
const getViewData = (corner) => {
  return [
    [corner[0], corner[1]],
    [corner[2], corner[1]],
    [corner[2], corner[3]],
    [corner[0], corner[3]],
  ].flat();
};
const clear = (gl) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};
const useTexture = (gl, texture, clearBool = true, resize = true) => {
  useFramebufferTexture(gl, texture, resize);
  if (clearBool) {
    clear(gl);
  }
};
export {
  shaderProgramFun,
  initShaderProgram,
  loadShader,
  setFramebuffer,
  useFramebufferTexture,
  createFramebufferTexture,
  createFramebufferTextures,
  arrayBufferData,
  //arrayBufferData0,
  elementArrayBufferData,
  createAndSetupTexture,
  loadTexture,
  attribFuns,
  uniformFuns,
  getViewData,
  clear,
  useTexture,
};
