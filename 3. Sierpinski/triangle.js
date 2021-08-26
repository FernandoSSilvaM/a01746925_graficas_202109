import * as shaderUtils from "../common/shaderUtils.js";

const mat4 = glMatrix.mat4;

// ModelView Matrix: defines where the triangle is positioned in the 3D coordinate system relative to the camera
// Projection Matrix: required by the shader to convert the 3D space into the 2D space of the viewport. 
let projectionMatrix, modelViewMatrix;

let shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These are constant during a rendering cycle, such as lights position.

// NOTE: #version 300 es must be the first line of your shader, so that webgl2 knows that the shader language is GLSL ES 3.0 instead of GLSL 1.0
const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        out vec4 fragColor;

        void main(void) {
        // Return the pixel color: always output white
        fragColor = vec4(0.0, 0.7, .6, 1.0);
    }`;


//Revis Cambios del slider, cambia texto y vuelve a dibujar el triangulo.
document.getElementById('myRange').addEventListener('change',function() {
  let tempRep = document.getElementById('myRange').value;
    document.getElementById("textDescr").innerHTML = "Recursiones: " + tempRep
  main(tempRep);
});

//Rrecibe las recursiones que se van a realizar
function main(recs) 
{
    const canvas = document.getElementById("webglcanvas");

    // Code to make the canvas full screen
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const gl = initWebGL(canvas);
    
    initViewport(gl, canvas);
    initMatrices(canvas);

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);

    let recursions = recs;
    var firstListaTriangulosVertex = [];
    //Se agrega los vertices triangulo base
    firstListaTriangulosVertex.push([0.0,1.0,-1,-1,1.0,-1.0]);

    //Es la lista final de vertices
    let finalListTrianglesVertex =permutateTriangles(firstListaTriangulosVertex, recursions);
    var listTriangles = [];

    //Transformo los vertices en traingulos
    for (let i = 0; i < finalListTrianglesVertex.length; i++) {
        let triangleVertex = finalListTrianglesVertex[i];
        let tempTriangle = createTriangle(gl, triangleVertex[0],triangleVertex[1],triangleVertex[2],triangleVertex[3],triangleVertex[4],
                                            triangleVertex[5]);
        listTriangles.push(tempTriangle);
        
    }
    
    
    bindShaderAttributes(gl, shaderProgram);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    for (let i = 0; i < listTriangles.length ;i++) {
        draw(gl, shaderProgram, listTriangles[i]);
    }
}




function permutateTriangles(listaTriangulos, recursions){

    if(recursions == 0){
        return listaTriangulos;
    } else{
        var tempList = []
        const repeat = listaTriangulos.length;
        /*
        En este ciclo se "borran" los vertices de (el/los) triangulos
        iniciales y se agregan los nuevos. Recurse si se quieren hacer mas
        permutaciones

        */
        for (let i = 0; i < repeat ;i++){
            let tempVertex = [listaTriangulos.pop()]
            //Se guarda como una matriz al parecer.asd..
            console.log(tempVertex)
            let x1 = tempVertex[0][0];
            let y1 = tempVertex[0][1];
            let x2 = tempVertex[0][2];
            let y2 = tempVertex[0][3];
            let x3 = tempVertex[0][4];
            let y3 = tempVertex[0][5]; 

            let a1 = (x1 + x2)/ 2.0
            let b1 = (y1 + y2)/ 2.0
            let a2 = (x1 + x3)/ 2.0
            let b2 = (y1 + y3)/ 2.0
            let a3 = x1
            let b3 = y2

            //Se crean los vertices de los triangulos
            //arriba
            tempList.push([ x1,y1,
                            a1,b1,
                            a2,b2]);
            //izquierda
            tempList.push([ a1,b1,
                            x2,y2,
                            a3,b3]);
            //derecha
            tempList.push([a2,b2,
                            a3,b3,
                            x3,y3]);

        }

        return permutateTriangles(tempList, (recursions-1));

    }

}


// Initializes the context for use with WebGL
function initWebGL(canvas) 
{

    let gl = null;
    const msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try {
        // The getContext method can take one of the following context id strings:
        // "2d" for a 2d canvas context, or "webgl2" for a WebGL context.
        gl = canvas.getContext("webgl2");
    } 
    catch (e){
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl){
        throw new Error(msg);
    }

    return gl;        
}

// The viewport is the rectangular bounds of where to draw. 
// In this case, the viewport will take up the entire contents of the canvas' display area.
function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initMatrices(canvas)
{
    // Create a model view matrix with object at 0, 0, -3.333
    modelViewMatrix = mat4.create();

    // translate(out, a, v) → {mat4}
    // out	mat4	the receiving matrix
    // a	mat4	the matrix to translate
    // v	vec3	vector to translate by
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);

    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    // perspective(out, fovy, aspect, near, far) → {mat4}
    // out	    mat4	mat4 frustum matrix will be written into
    // fovy	    number	Vertical field of view in radians
    // aspect	number	Aspect ratio. typically viewport width/height
    // near	    number	Near bound of the frustum
    // far	    number	Far bound of the frustum
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 5);
}

// Create the vertex data for a Triangle to be drawn.
// WebGL drawing is done with primitives — different types of objects to draw. WebGL primitive types include triangles, points, and lines. 
// Triangles, the most commonly used primitive, are actually accessible in two different forms: as triangle sets (arrays of triangles) and triangle strips (described shortly). 
// Primitives use arrays of data, called buffers, which define the positions of the vertices to be drawn.
function createTriangle(gl, x1, y1, x2, y2, x3, y3) 
{
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // let verts = [
    //     0.0, 1, 0.0,
    //     -1, -1,  0.0,
    //     1, -1, 0.0,
    // ];

    let verts = [
        x1, y1, 0.0,
        x2, y2, 0.0,
        x3, y3, 0.0,
    ];

    // void gl.bufferData(target, ArrayBufferView srcData, usage, srcOffset, length);
    // target = gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
    // srcData = This is a new data type introduced into web browsers for use with WebGL. Float32Array is a type of ArrayBuffer, also known as a typed array. This is a JavaScript type that stores compact binary data. 
    // usage = A GLenum specifying the usage pattern of the data store. gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // The resulting object contains the vertexbuffer, the size of the vertex structure (3 floats, x, y, z), the number of vertices to be drawn, the the primitive to draw.
    let triangle = {buffer:vertexBuffer, vertSize: 3, nVerts: 3, primtype:gl.TRIANGLE_STRIP};
    
    return triangle;
}

function bindShaderAttributes(gl, shaderProgram)
{
    // Obtain handles to each of the variables defined in the GLSL shader code so that they can be initialized
    // gl.getAttribLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the attribute variable whose location to get
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);
    
    // gl.getUniformLocation(program, name);
    // program  A webgl program containing the attribute variable
    // name     A domString specifying the name of the uniform variable whose location to get
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, obj) 
{
    // clear the background (with black)
   // gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Clears the color buffer; the area in GPU memory used to render the bits on screen.
    // There are several buffers, including the color, and depth buffers.
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    // connect up the shader parameters: vertex position and projection/model matrices
    // set the vertex buffer to be drawn
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);

    // Specifies the memory layout of the vertex buffer object. It must be called once for each vertex attribute.
    // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
    // index: A GLuint specifying the index of the vertex attribute that is to be modified.
    // size: A GLint specifying the number of components per vertex attribute. Must be 1, 2, 3, or 4.
    // type: A GLenum specifying the data type of each component in the array.
    // normalized: A GLboolean specifying whether integer data values should be normalized into a certain range when being casted to a float.
    // stride: A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes.
    // offset: A GLintptr specifying an offset in bytes of the first component in the vertex attribute array
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    // WebGLRenderingContext.uniformMatrix4fv(location, transpose, value); 
    // location: A WebGLUniformLocation object containing the location of the uniform attribute to modify. The location is obtained using getAttribLocation().
    // transpose: A GLboolean specifying whether to transpose the matrix.
    // value: A Float32Array or sequence of GLfloat values.
    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

    // draw the object
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

//la recursion default es 0
window.onload = main(0);
//main();