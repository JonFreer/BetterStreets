import React, { useRef, useEffect, useState, ChangeEvent } from 'react';
import {MdOutlineDone} from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import {FaUndoAlt} from 'react-icons/fa';
function ImageDraw(props: { open: boolean, img: any, callback:any }) {
    const [canvas, setCanvas] = useState(document.createElement('canvas'));
    const [maskCanvas, setMaskCanvas] = useState(document.createElement('canvas'));
    const [img, setImg] = useState(new Image())
    const [points,setPoints] = useState<any>([]);
    // const [mouseDown,setMouseDown] = useState(false);
    // const [x, setX] = useState(0);
    // const [y, setY] = useState(0);
    useEffect(() => {
        if (props.open) {
            document.getElementById("imgHolder")?.appendChild(canvas);
            document.getElementById("imgHolder")?.appendChild(maskCanvas);
            canvas.width = 1000;
            maskCanvas.width = 1000;

            // canvas.hei
            canvas.classList.add("canvas_draw");
            maskCanvas.classList.add("canvas_mask")
            img.onload = function () {
                canvas.height = img.height / (img.width / 1000)
                maskCanvas.height = img.height / (img.width / 1000)
                draw()
            }
            img.src = props.img;
            // const mask_ctx = maskCanvas.getContext('2d');
            // if (mask_ctx) {
            //     console.log("setting width")
            //     mask_ctx.lineWidth = 20;
            //     mask_ctx.lineCap = 'round';
            // }

            maskCanvas.addEventListener('mousedown', startDrawing);
            maskCanvas.addEventListener('mousemove', mouseMove);
            maskCanvas.addEventListener('mouseup', stopDrawing);
            maskCanvas.addEventListener('mouseout', stopDrawing);
            maskCanvas.addEventListener('touchstart',startDrawing_touch);
            maskCanvas.addEventListener('touchmove',touchMove);
            maskCanvas.addEventListener('touchend',stopDrawing);
            // draw()
        }

    }, [props.open])
    var isMouseDown = false;
    var x = 0;
    var y = 0;

    const stopDrawing = () => {
        console.log("stop")
        // setMouseDown(false);
        isMouseDown = false;
        points.push({mode: "end" });
    }

    const startDrawing = (event: any) => {
        isMouseDown = true;
        [x, y] = [event.offsetX* canvas.width / canvas.clientWidth , event.offsetY* canvas.height / canvas.clientHeight ];
        points.push({ mode: "begin" });
    }

    const startDrawing_touch = (event: any) => {
        isMouseDown = true;
        const x_ = (event.changedTouches[0].clientX-canvas.getBoundingClientRect().left) * canvas.width / canvas.clientWidth;
        const y_ = (event.changedTouches[0].clientY-canvas.getBoundingClientRect().top)* canvas.height / canvas.clientHeight;
        [x,y] =[x_,y_];
        // [x, y] = [event.changedTouches[0].clientX* canvas.width / canvas.clientWidth , event.changedTouches[0].clientY* canvas.height / canvas.clientHeight ];
        points.push({ mode: "begin" });
    }


    const mouseMove = (event:any)=>{
            if (isMouseDown) {
                const x = event.offsetX* canvas.width / canvas.clientWidth;
                const y = event.offsetY* canvas.height / canvas.clientHeight;
                drawLine(x,y);
            }
    }

    const touchMove = (event:any)=>{
        if (isMouseDown) {
            const x = (event.changedTouches[0].clientX-canvas.getBoundingClientRect().left) * canvas.width / canvas.clientWidth;
            const y = (event.changedTouches[0].clientY-canvas.getBoundingClientRect().top)* canvas.height / canvas.clientHeight;
            drawLine(x,y);
            event.preventDefault();
        }
    }

    const drawLine = (x_:number,y_:number) => {

            const mask_ctx = maskCanvas.getContext('2d');
            
            if(mask_ctx==null){ return }
            mask_ctx.lineWidth = 30;
            mask_ctx.lineCap = 'round';
            const newX = x_;
            const newY = y_;
            mask_ctx.beginPath();
            mask_ctx.moveTo(x, y);
            mask_ctx.lineTo(newX, newY);
            mask_ctx.stroke();

            points.push({
                newX: newX,
                newY: newY,
                x: x,
                y: y,
                // size: brushSize,
                // color: brushColor,
                mode: "draw"
            });
            // setX(newX);
            // setY(newY);
            x = newX;
            y = newY;
            draw();
        
    }

    function undo(){
        recursivePop()
        redrawMask()
    }

    function recursivePop(){
        if(points.length==0){
            return
        }
        var last = points.pop()
        if(last.mode!="begin"){
            recursivePop()
        }
    }

    function redrawMask() {
        const mask_ctx = maskCanvas.getContext('2d');
        if(mask_ctx == null){ return }
        mask_ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < points.length; i++) {
            if (points[i].mode == "draw") {
                mask_ctx.beginPath();
                mask_ctx.moveTo(points[i].x, points[i].y);
                mask_ctx.lineTo(points[i].newX, points[i].newY);
                mask_ctx.stroke();
            }

        }
        draw()
    }

    function draw() {
        // if (canvas == null || maskCanvas == null) { return }
        const ctx = canvas.getContext('2d');
        const ctx_mask = maskCanvas.getContext('2d');
       
        if (ctx == null || ctx_mask == null) { return }
        ctx.imageSmoothingQuality = "high"
        ctx.imageSmoothingEnabled=true;
        // ctx.mozImageSmoothingEnabled    = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.filter = 'blur(0px)';
        ctx.globalCompositeOperation = 'destination-over';
        ctx.filter = 'blur(0px)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    function submit(){
        canvas.toBlob(function(blob) {
            props.callback(blob);
        }, 'image/jpeg')
    }

    if (props.open) {
        return (<div id="imgHolder" >
            {/* <div className = "img_button_submit">Undo</div> */}
            <div className = "img_button_submit">
                {/* <AiOutlineEdit className='icon_form'></AiOutlineEdit> */}
                <MdOutlineDone className='icon_img_submit' onClick={()=>submit()}></MdOutlineDone>
                </div>
                <div className = "img_button_undo" onClick={()=>undo()}>
                {/* <AiOutlineEdit className='icon_form'></AiOutlineEdit> */}
                <FaUndoAlt className='icon_img_undo'></FaUndoAlt>
                </div>
        </div>)
    } else {
        return (<div id="imgHolder" >

        </div>)
    }


}

export default ImageDraw;

