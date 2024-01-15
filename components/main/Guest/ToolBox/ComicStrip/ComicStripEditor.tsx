import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Line, Transformer, Text, Rect, Group } from 'react-konva';
import { Tooltip } from 'react-tooltip';
import TitleIcon from '@mui/icons-material/Title';
import HelpIcon from '@mui/icons-material/Help';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ImageIcon from '@mui/icons-material/Image';
import { ComicPanel } from '@/types/comicstrip.type';
import Spinner from '@/components/Spinner';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import $ from 'jquery';

interface LineType {
    tool: string;
    points: number[];
}

let selectionTr = new Konva.Transformer();

let x1: number;
let x2: number;
let y1: number;
let y2: number;

const ComicStripEditor = ({ 
    showTipsModal, 
    updatePanel, 
    panelData, 
    selectedPanel,
    isEditable,
    type
}: { 
    showTipsModal?: any, 
    updatePanel?: any, 
    panelData?: ComicPanel[],
    selectedPanel: number,
    isEditable: boolean,
    type?: string
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputImageFileRef = useRef<HTMLInputElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const selectionRef = useRef<Konva.Rect>(null);
    const groupRef = useRef<Konva.Group>(null);

    const [transformProps, setTransformProps] = useState({
        rotationSnaps: [0, 45, 90, 135, 180, -45, -90, -135],
    });

    const [selectionProps, setSelectionProps] = useState({
        fill: "#9ad1e7",
        stroke: "#1071ea",
        opacity: 0.5,
        visible: false,
    });

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [pencilImage, setPencilImage] = useState<any>(null);
    const [eraserImage, setEraserImage] = useState<any>(null);
    const [backgroundImage, setBackgroundImage] = useState<any>(null);
    const [visibleDrawingCursor, setVisibleDrawingCursor] = useState<boolean>(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [tool, setTool] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    const [drawingTool, setDrawingTool] = useState('pen');
    const [isToolSelected, setIsToolSelected] = useState(false);
    const [lines, setLines] = useState<LineType[]>([]);
    const isDrawing = useRef(false);

    const handleMouseDown = (e: any) => {
        if (!isEditable) {
            return;
        }
        var shape = e.target;
        if (tool != 'drawing' && shape.getClassName() == 'Stage') {
            deselectAllComponents();
            e.evt.preventDefault();
            x1 = e.target.getStage().getPointerPosition().x;
            y1 = e.target.getStage().getPointerPosition().y;
            x2 = e.target.getStage().getPointerPosition().x;
            y2 = e.target.getStage().getPointerPosition().y;

            if (selectionRef.current) {
                selectionRef.current.visible(true);
                selectionRef.current.width(0);
                selectionRef.current.height(0);
            }
            return;
        }
        // if (tool == 'drawing') {
        //     deselectAllComponents();
        //     isDrawing.current = true;
        //     const pos = e.target.getStage().getPointerPosition();
        //     setLines([...lines, { tool: drawingTool, points: [pos.x, pos.y] }]);
        //     return;
        // }
    };

    const handleMouseOut = (e: any) => {
        setVisibleDrawingCursor(false);
    }

    const handleMouseIn = (e: any) => {
        setVisibleDrawingCursor(true);
    }

    const updateStage = () => {
        if (layerRef.current && isEditable) {
            const dataURL = layerRef.current.toDataURL({ pixelRatio: 0.6 });
            if (groupRef.current && dataURL.length > 6) { 
                const group = groupRef.current;
                const nodes = group.getChildren();
                var convertedNodes: any[] = [];
                nodes.map((nodeItem) => {
                    if (nodeItem.getClassName() == 'Image') {
                        nodeItem.toImage().then((image: any) => {
                            var node = JSON.stringify({
                                attrs: nodeItem.attrs,
                                className: 'Image',
                                src: image.src
                            });
                            convertedNodes.push(node);
                        });
                    } else {
                        convertedNodes.push(nodeItem);
                    }
                })
                updatePanel({
                    thumbnail: dataURL, 
                    thumbPubId: panelData != undefined ? panelData[selectedPanel]?.thumbPubId : '', 
                    nodes: convertedNodes
                });
                setTool('');
            }
        }
    }

    const handleMouseMove = (e: any) => {
        if (!isEditable) {
            return;
        }
        const stage = e.target.getStage();
        var shape = e.target;

        // setPosition({ x: stage.getPointerPosition().x, y: stage.getPointerPosition().y - 19 });

        if (tool != 'drawing' && shape.getClassName() == 'Stage') {
            e.evt.preventDefault();
            x2 = stage.getPointerPosition().x;
            y2 = stage.getPointerPosition().y;

            if (x1 != undefined && y1 != undefined && x2 != undefined && y2 != undefined) {
                setSelectionProps((prevProps) => ({
                    ...prevProps,
                    x: Math.min(x1, x2),
                    y: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1),
                }));
            }

            return;
        }
    };

    const handleMouseUp = (e: any) => {
        if (!isEditable) {
            return;
        }
        var shape = e.target;
        if (tool != 'drawing') {
            if (selectionRef.current) {
                const selectionRectangle = selectionRef.current;
                if (!selectionRectangle.visible()) {
                    return;
                }

                e.evt.preventDefault();

                setTimeout(() => {
                    selectionRectangle.visible(false);
                });

                if (groupRef.current) {
                    let shapes = groupRef.current.getChildren();

                    let box = selectionRectangle.getClientRect();

                    let selected = shapes.filter((shape) => {
                        return Konva.Util.haveIntersection(box, shape.getClientRect());
                    });

                    changeTransformerAnchors(0);
                    if (selected.length === 1) {
                        const nodeType = selected[0].getClassName();
                        if (nodeType == 'Text') {
                            changeTransformerAnchors(1);
                        } else if (nodeType == 'Image') {
                            changeTransformerAnchors(2);
                        } else {
                            changeTransformerAnchors(1);
                        }
                    }

                    selectionTr.nodes(selected);
                    selectionTr.show();
                }
                return;
            }
            return;
        }
        // isDrawing.current = false;
    };

    useEffect(() => {
        const bgImage = new window.Image();
        bgImage.src = '/static/images/comicbackground.svg';
        bgImage.onload = () => {
            setBackgroundImage(bgImage);
        };

        if (stageRef.current) {
            setWidth(stageRef.current.clientWidth);
            setHeight(stageRef.current.clientWidth * 9 / 16);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const drawElements = () => {
        if (groupRef.current) {
            const workingArea = groupRef.current;
            if (panelData != undefined && panelData[selectedPanel] != null && panelData[selectedPanel] != undefined) {
                setIsLoading(true);
                workingArea.removeChildren();
                panelData[selectedPanel].nodes.map(async (nodeItem: any) => {
                    var node = nodeItem;
                    if (node != undefined) {
                        if (typeof nodeItem == 'string') {
                            var tempNode = JSON.parse(nodeItem);
                            node = await generateNode(tempNode);
                            if (node) {
                                workingArea.add(node);
                                if (isEditable) {
                                    addEvents(node.className, node);
                                }
                            }
                        } else {
                            workingArea.add(node);
                            if (isEditable) {
                                addEvents(node.getClassName(), node);
                            }
                        }
                    }
                });
                if (layerRef.current) {
                    layerRef.current.batchDraw();
                    deselectAllComponents();
                }
                // updateStage();
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        drawElements();
    }, [selectedPanel]);

    async function generateNode(nodeData: any) {
        let node;
        switch(nodeData.className) {
            case 'Image':
                let imageObj = new Image();
                imageObj.src = nodeData.src;
                imageObj.setAttribute("crossOrigin", "anonymous");

                await new Promise<void>((resolve, reject) => {
                    imageObj.onload = () => {
                        node = new Konva.Image({
                            ...nodeData.attrs,
                            image: imageObj,
                            draggable: isEditable,
                        });
                        resolve();
                    };
            
                    imageObj.onerror = (error) => {
                        reject(error);
                    };
                });

                break;
            case 'Text':
                node = new Konva.Text({
                    ...nodeData.attrs,
                    draggable: isEditable,
                });
                break;
            case 'Arrow':
                node = new Konva.Arrow({
                    ...nodeData.attrs,
                    draggable: isEditable,
                });
                break;
        }

        return node;
    }

    const addEvents = (nodeType: string, nodeItem: any) => {
        switch(nodeType) {
            case 'Image':
                addImageEvents(nodeItem);
                break;
            case 'Text':
                addTextEvents(nodeItem);
                break;
            case 'Arrow':
                addArrowEvents(nodeItem);
                break;
        }
    }

    const addArrowEvents = (nodeItem: any) => {
        if (transformerRef.current) {
            selectionTr = transformerRef.current
        }

        nodeItem.on("click", function (e: any) {
            var target = e.target;
            changeTransformerAnchors(3);
            setTool('arrow');
            nodeItem.show();
            selectionTr.show();
            selectionTr.forceUpdate();
            selectionTr.nodes([target]);
            
            updateStage();
        });

        nodeItem.on("transform", function () {
            changeTransformerAnchors(3);
            
            updateStage();
        });

        nodeItem.on("mousedown", function (e: any) {
            var target = e.target;
            changeTransformerAnchors(3);
            setTool('arrow');
            if (selectionTr.nodes().length == 1) deselectAllComponents();
            if (selectionTr.nodes().length == 0) {
                selectionTr.nodes([target]);
                selectionTr.show();
            } else {
                selectionTr.show();
            }
            
            updateStage();
        });

        nodeItem.on("mouseup", function () {
            changeTransformerAnchors(3);
            setTool('arrow');
            
            updateStage();
        });

        document.addEventListener("keydown", function (event) {
            const keyCode = event.keyCode;
            if (keyCode === 46 && selectionTr.nodes().length > 0) {
                selectionTr.nodes().map(function (node) {
                    node.destroy();
                });
                selectionTr.hide();
                
                updateStage();
            }
        });
    }

    const addImageEvents = (nodeItem: any) => {
        if (transformerRef.current) {
            selectionTr = transformerRef.current
        }

        deselectAllComponents();
        selectionTr.nodes([nodeItem]);
        selectionTr.show();

        nodeItem.setAttrs({
            width: nodeItem.width() * nodeItem.scaleX(),
            height: nodeItem.height() * nodeItem.scaleY(),
        });

        nodeItem.scaleX(1);
        nodeItem.scaleY(1);
        selectionTr.forceUpdate();

        nodeItem.on("transform", function () {
            changeTransformerAnchors(2);
            nodeItem.setAttrs({
                scaleX: 1,
                scaleY: 1,
                width: nodeItem.width() * nodeItem.scaleX(),
                height: nodeItem.height() * nodeItem.scaleY(),
            });
            
            updateStage();
        });

        nodeItem.on("click touchend", function (e: any) {
            var target = e.target;
            changeTransformerAnchors(2);
            deselectAllComponents();
            selectionTr.nodes([target]);
            selectionTr.show();
            nodeItem.show();
            selectionTr.forceUpdate();
            
            updateStage();
        });

        nodeItem.on("mousedown", function (e: any) {
            var target = e.target;
            changeTransformerAnchors(2);
            setTool('image');
            if (selectionTr.nodes().length == 1) deselectAllComponents();
            if (selectionTr.nodes().length == 0) {
                selectionTr.nodes([target]);
                selectionTr.show();
            } else {
                selectionTr.show();
            }
            
            updateStage();
        });

        nodeItem.on("mouseup", function () {
            changeTransformerAnchors(2);
            
            updateStage();
        });

        document.addEventListener("keydown", function (event) {
            const keyCode = event.keyCode;
            if (keyCode === 46 && selectionTr.nodes().length > 0) {
                selectionTr.nodes().map(function (node) {
                    node.destroy();
                });
                selectionTr.hide();
                
                updateStage();
            }
        });
    }

    const addTextEvents = (nodeItem: any) => {
        setTransformProps((prevProps) => ({
            ...prevProps,
            enabledAnchors: [
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
            ],
            rotationSnaps: [0, 45, 90, 135, 180, -45, -90, -135],
            keepRatio: true,
            boundBoxFunc: function (oldBox: any, newBox: any) {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
            },
        }));

        if (transformerRef.current) {
            selectionTr = transformerRef.current
        }

        selectionTr.nodes([nodeItem]);

        nodeItem.on("transform", function (e: any) {
            var target = e.target;
            setTool('text');

            changeTransformerAnchors(1);
            const newRatio = (nodeItem.scaleX() / nodeItem.scaleY()).toFixed(2);
            const activeAnchor = selectionTr.getActiveAnchor();
            switch (activeAnchor) {
                case "top-left":
                case "top-right":
                case "bottom-left":
                case "bottom-right":
                    nodeItem.setAttrs({
                        width: target.width() * target.scaleX(),
                        fontSize: target.fontSize() * target.scaleX(),
                    });
                    break;
                case "middle-left":
                case "middle-right":
                    target.width(Math.max(200, target.width() * target.scaleX()));
                    break;
                case "rotator":
                    break;
            }
            target.scaleX(1);
            target.scaleY(1);
            selectionTr.forceUpdate();
            
            updateStage();
        });

        selectionTr.show();

        nodeItem.setAttrs({
            width: nodeItem.width() * nodeItem.scaleX(),
            fontSize: nodeItem.fontSize() * nodeItem.scaleX(),
        });

        nodeItem.scaleX(1);
        nodeItem.scaleY(1);
        selectionTr.forceUpdate();

        nodeItem.on("click", function (e: any) {
            var target = e.target;
            if (tool != 'drawing') {
                changeTransformerAnchors(1);
                setTool('text');
                nodeItem.show();
                selectionTr.show();
                selectionTr.forceUpdate();
                selectionTr.nodes([target]);
                
                updateStage();
            }
        });

        nodeItem.on("mousedown", function (e: any) {
            var target = e.target;
            if (tool != 'drawing') {
                changeTransformerAnchors(1);
                setTool('text');
                if (selectionTr.nodes().length == 1) deselectAllComponents();
                if (selectionTr.nodes().length == 0) {
                    selectionTr.nodes([target]);
                    selectionTr.show();
                } else {
                    selectionTr.show();
                }
                
                updateStage();
            }
        });

        nodeItem.on("mouseup", function () {
            if (tool != 'drawing') {
                changeTransformerAnchors(1);
                setTool('text');
                
                updateStage();
            }
        });

        nodeItem.on("dblclick dbltap", function () {
            if (tool != 'drawing') {
                setTool('text');
                changeTransformerAnchors(1);
                nodeItem.hide();
                selectionTr.show();

                var textPosition = nodeItem.absolutePosition();

                if (stageRef.current) {
                    const stageContainer = stageRef.current;
                    var areaPosition = {
                        // x: stageContainer.offsetLeft + textPosition.x,
                        // y: stageContainer.offsetTop + textPosition.y,
                        x: textPosition.x,
                        y: textPosition.y,
                    };

                    var textarea = document.createElement("textarea");
                    textarea.id = "txt";
                    stageRef.current.appendChild(textarea);

                    textarea.value = nodeItem.text();
                    textarea.style.position = "absolute";
                    textarea.style.top = areaPosition.y + "px";
                    textarea.style.left = areaPosition.x + "px";
                    textarea.style.width = nodeItem.width() - nodeItem.padding() * 2 + "px";
                    textarea.style.height =
                        nodeItem.height() - nodeItem.padding() * 2 + 5 + "px";
                    textarea.style.fontSize = nodeItem.fontSize() + "px";
                    textarea.style.border = "none";
                    textarea.style.padding = "0px";
                    textarea.style.margin = "0px";
                    textarea.style.overflow = "hidden";
                    textarea.style.background = "none";
                    textarea.style.outline = "none";
                    textarea.style.resize = "none";
                    textarea.style.lineHeight = nodeItem.lineHeight().toString();
                    textarea.style.fontFamily = nodeItem.fontFamily();
                    textarea.style.transformOrigin = "left top";
                    textarea.style.textAlign = nodeItem.align();
                    textarea.style.color = nodeItem.fill();
                    var rotation = nodeItem.rotation();
                    var transform = "";
                    if (rotation) {
                        transform += "rotateZ(" + rotation + "deg)";
                    }

                    var px = 0;
                    var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

                    if (isFirefox) {
                        px += 2 + Math.round(nodeItem.fontSize() / 20);
                    }
                    transform += "translateY(-" + px + "px)";

                    textarea.style.transform = transform;

                    // reset height
                    textarea.style.height = "auto";
                    textarea.style.height = textarea.scrollHeight + 3 + "px";

                    textarea.focus();

                    const removeTextarea = () => {
                        textarea.parentNode?.removeChild(textarea);
                        window.removeEventListener("click", handleOutsideClick);
                        nodeItem.show();
                        
                        updateStage();
                    }

                    const setTextareaWidth = (newWidth: any) => {
                        if (!newWidth) {
                            newWidth = nodeItem.text().length * nodeItem.fontSize();
                        }

                        var isSafari = /^((?!chrome|android).)*safari/i.test(
                            navigator.userAgent
                        );
                        var isFirefox =
                            navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                        if (isSafari || isFirefox) {
                            newWidth = Math.ceil(newWidth);
                        }

                        var isEdge = (document as any).documentMode || /Edge/.test(navigator.userAgent);
                        if (isEdge) {
                            newWidth += 1;
                        }
                        textarea.style.width = newWidth + "px";
                    }

                    textarea.addEventListener("keydown", function (e) {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            nodeItem.text(textarea.value);
                            removeTextarea();
                        }
                        if (e.keyCode === 27) {
                            removeTextarea();
                        }
                    });

                    textarea.addEventListener("keydown", function (e) {
                        var scale = nodeItem.getAbsoluteScale().x;
                        setTextareaWidth(nodeItem.width() * scale);
                        textarea.style.height = "auto";
                        textarea.style.height =
                            textarea.scrollHeight + nodeItem.fontSize() + "px";
                    });

                    textarea.addEventListener("input", function (e) {
                        textarea.style.height = "auto";
                        if (textarea.clientHeight >= textarea.scrollHeight) {
                            textarea.style.height =
                                textarea.scrollHeight - nodeItem.fontSize() + "px";
                        } else {
                            textarea.style.height = textarea.scrollHeight + "px";
                        }

                        nodeItem.text(textarea.value);
                        selectionTr.forceUpdate();
                        
                        updateStage();
                    });

                    const handleOutsideClick = (e: any) => {
                        if (e.target !== textarea) {
                            nodeItem.text(textarea.value);
                            removeTextarea();
                        }
                        setTool('');
                    }
                    setTimeout(() => {
                        window.addEventListener("click", handleOutsideClick);
                    });
                }
            }
        });

        document.addEventListener("keydown", function (event) {
            const keyCode = event.keyCode;
            if (keyCode === 46 && selectionTr.nodes().length > 0) {
                selectionTr.nodes().map(function (node) {
                    node.destroy();
                });
                selectionTr.hide();
                
                updateStage();
            }
        });
    }

    const handleResize = () => {
        if (stageRef.current) {
            setWidth(stageRef.current.clientWidth);
            setHeight(stageRef.current.clientWidth * 9 / 16);
        }
    };

    const changeTransformerAnchors = (index: number) => {
        // selectionnode : 0
        // textnode : 1
        // imagenode : 2
        // arrownode : 3
        switch (index) {
            case 0:
                setTransformProps((prevProps) => ({
                    ...prevProps,
                    enabledAnchors: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                    ],
                }));
                break;
            case 1:
                setTransformProps((prevProps) => ({
                    ...prevProps,
                    enabledAnchors: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                        "middle-left",
                        "middle-right",
                    ],
                }));
                break;
            case 2:
                setTransformProps((prevProps) => ({
                    ...prevProps,
                    enabledAnchors: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                        "middle-left",
                        "middle-right",
                        "top-center",
                        "bottom-center",
                    ],
                }));
                break;
            case 3:
                setTransformProps((prevProps) => ({
                    ...prevProps,
                    enabledAnchors: [
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                        "middle-left",
                        "middle-right",
                    ],
                }));
                break;
        }
    }

    const addDrawingElement = () => {
        setDrawingTool('pen');
        setTool('drawing');
        deselectAllComponents();
    }

    const addTextElement = () => {
        setTool('text');
        const workingArea = groupRef.current;
        var textNode = new Konva.Text({
            text: "Hello World",
            x: width / 2 - 70,
            y: height / 2 - 15,
            fontSize: 30,
            fontFamily: `'Roboto', sans-serif`,
            draggable: isEditable,
            fill: 'black',
            id: 'text-',
            cornerRadius: 0
        });

        // nodeList.push(textNode);
        // id++;
        if (workingArea) {
            workingArea.add(textNode);
            
            updateStage();
            addTextEvents(textNode);
        }
        setTool('');
    }

    function addImageElement() {
        if (inputImageFileRef.current) {
            inputImageFileRef.current.click();
        }
    }

    const deselectAllComponents = () => {
        if (transformerRef.current) {
            selectionTr = transformerRef.current
            selectionTr.hide();
            selectionTr.nodes([]);
            selectionTr.forceUpdate();
        }
    }

    const addArrowElement = () => {
        setTool('arrow');

        var arrowNode = new Konva.Arrow({
            points: [width / 3, height / 2, width * 2 / 3, height / 2],
            pointerLength: 10,
            pointerWidth: 10,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4,
            draggable: isEditable
        });

        const workingArea = groupRef.current;

        if (workingArea) {
            workingArea.add(arrowNode);
            
            
            updateStage();
            deselectAllComponents();
            addArrowEvents(arrowNode);

            setTool('');
        }
    }

    const addImageNode = (imageWidth: number, imageHeight: number, imageObj: any) => {
        const imageRatio = imageWidth / imageHeight;
        const xRatio = imageWidth / width;
        const yRatio = imageHeight / height;
        let w = imageWidth;
        let h = imageHeight;
        if (xRatio > yRatio) {
            if (xRatio >= 1) {
                w = width * 0.9;
                h = w / imageRatio;
            }
        } else {
            if (yRatio >= 1) {
                h = height * 0.9;
                w = h * imageRatio;
            }
        }
        let imageNode = new Konva.Image({
            x: (width - w) / 2,
            y: (height - h) / 2,
            image: imageObj,
            draggable: isEditable,
            width: w,
            height: h
        });

        const workingArea = groupRef.current;

        if (workingArea) {
            workingArea.add(imageNode);
            
            updateStage();
            addImageEvents(imageNode);

            setTool('');
        }
    }

    const handleImageFileSelect = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            if (reader.result != null) {
                setTool('image')
                setImageSrc(reader.result.toString());

                let imageObj = new Image();
                let imageSrc = reader.result.toString()
                
                imageObj.setAttribute("crossOrigin", "anonymous");

                imageObj.src = imageSrc;

                let imageWidth = 0;
                let imageHeight = 0;

                imageObj.addEventListener("load", () => {
                    imageWidth = imageObj.width;
                    imageHeight = imageObj.height;
                    addImageNode(imageWidth, imageHeight, imageObj);
                });
            }
        });

        if (file) {
            reader.readAsDataURL(file);
        }
    }


    return (
        <div>
            <div ref={stageRef} className={`relative bg-comic_bg border border-[#424242] border-2 comic-stage`}>
                {
                    isLoading ?
                    <div className={`grid place-items-center`} style={{ height: height + 'px' }}>
                        <Spinner text='Loading Panel ...'/>
                    </div> :
                    <Stage
                        width={width}
                        height={height}
                        style={{ 
                            cursor: tool == 'drawing' ? 'none' : 'default',
                        }}
                        onMouseDown={handleMouseDown}
                        onMousemove={handleMouseMove}
                        onMouseup={handleMouseUp}
                        onMouseLeave={handleMouseOut}
                        onMouseEnter={handleMouseIn}
                        backgroundImage={backgroundImage}
                    >
                        <Layer
                            ref={layerRef}
                        >   
                            {/* {lines.map((line, i) => (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke="#000000"
                                    strokeWidth={2}
                                    tension={0.5}
                                    lineCap="round"
                                    lineJoin="round"
                                    globalCompositeOperation={
                                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                    }
                                >
                                </Line>
                            ))} */}
                            <Group ref={groupRef} >
                            </Group>
                            <Rect {...selectionProps} ref={selectionRef} />
                            {/* {
                                tool == 'drawing' && visibleDrawingCursor && (
                                    drawingTool == 'pen' ?
                                    <Image image={pencilImage} width={20} height={20} x={position.x} y={position.y} />
                                    :
                                    <Image image={eraserImage} width={15} height={15} x={position.x - 7.5} y={position.y + 7.5} />
                                )
                            } */}
                        </Layer>
                        <Layer>
                            <Transformer {...transformProps} ref={transformerRef} />
                        </Layer>
                    </Stage>
                }
            </div>
            {
                isEditable && 
                <div className="flex py-[35px] justify-center">
                    <div className="rounded-md shadow-md p-4 flex gap-x-8">
                        <input type="file" className="hidden" name="image" ref={inputImageFileRef} onChange={handleImageFileSelect} />
                        <button
                            className={`${tool == 'image' ? 'bg-[#E5632B] text-white border-[#E5632B]' : 'bg-white text-black border-secondary-gray-4'} border border-1 text-black px-2 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-[#E5632B] hover:text-white hover:border-[#E5632B]`}
                            onClick={addImageElement}
                            data-tooltip-id={"panel-tool-tip"}
                            data-tooltip-content="Image"
                            data-tooltip-place="top"
                        >
                            <ImageIcon fontSize="large" />
                        </button>
                        <button
                            className={`${tool == 'text' ? 'bg-[#E5632B] text-white border-[#E5632B]' : 'bg-white text-black border-secondary-gray-4'} border border-1 border-[#E5632B] text-black px-2 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-[#E5632B] hover:text-white hover:border-[#E5632B]`}
                            onClick={addTextElement}
                            data-tooltip-id={"panel-tool-tip"}
                            data-tooltip-content="Text"
                            data-tooltip-place="top"
                        >
                            <TitleIcon fontSize="large" />
                        </button>
                        <button
                            className={`${tool == 'arrow' ? 'bg-[#E5632B] text-white border-[#E5632B]' : 'bg-white text-black border-secondary-gray-4'} border border-1 border-[#E5632B] text-black px-2 py-2 rounded shadow outline-none focus:outline-none ease-linear transition-all duration-150 hover:bg-[#E5632B] hover:text-white hover:border-[#E5632B]`}
                            onClick={addArrowElement}
                            data-tooltip-id={"panel-tool-tip"}
                            data-tooltip-content="Arrow"
                            data-tooltip-place="top"
                        >
                            <ArrowForwardIcon fontSize="large" />
                        </button>
                        {/* <button
                            className={`${tool == 'drawing' && drawingTool == 'pen' ? 'bg-tertiary-red text-white' : 'bg-white text-tertiary-red'} border border-1 border-tertiary-red px-1 py-1 rounded shadow outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-tertiary-red hover:text-white`}
                            onClick={addDrawingElement}
                            data-tooltip-id={"panel-tool-tip"}
                            data-tooltip-content="Pencil"
                            data-tooltip-place="top"
                        >
                            <DriveFileRenameOutlineIcon />
                        </button>
                        <button
                            className={`${tool == 'drawing' && drawingTool == 'eraser' ? 'bg-tertiary-red text-white' : 'bg-white text-tertiary-red'} border border-1 border-tertiary-red px-1 py-1 rounded shadow outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-tertiary-red hover:text-white`}
                            onClick={() => {
                                setTool('drawing');
                                setDrawingTool('eraser');
                            }}
                            data-tooltip-id={"panel-tool-tip"}
                            data-tooltip-content="Erase"
                            data-tooltip-place="top"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53l-4.95-4.95l-4.95 4.95Z" /></svg>
                        </button> */}

                        <Tooltip id={"panel-tool-tip"} />
                    </div>
                </div>
            }
            {
                isEditable &&
                <div className='font-Inter flex items-center justify-center'>
                    <a className='cursor-pointer flex items-center gap-x-2 text-[#4F4F4F]' 
                        onClick={() => {
                            showTipsModal(true);
                        }}
                    ><HelpIcon /> Tips For Creating The {type} Comic Strip</a>
                </div>
            }
        </div>
    );
};

export default ComicStripEditor;