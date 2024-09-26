import {useEffect, useRef} from "react";
import type {Point} from "~core/trajectory";
import * as d3 from 'd3';

type SvgProps = {
  points: Point []
  width: number
  height: number
}

export default (props: SvgProps) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const data = props.points;
    const width = props.width;
    const height = props.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 选择SVG元素
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'flex items-center justify-center')

    // 设置线条生成器
    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5)); // 可选：设置曲线类型

    // 清除先前的内容
    svg.selectAll('*').remove();

    // 计算数据的边界框
    const xExtent = d3.extent(data, d => d.x);
    const yExtent = d3.extent(data, d => d.y);
    const dataWidth = xExtent[1] - xExtent[0];
    const dataHeight = yExtent[1] - yExtent[0];

    // 计算缩放因子
    const scaleFactor = Math.min(width / dataWidth, height / dataHeight) * 0.6;

    // 缩放和转换数据
    const scaledData = data.map(d => ({
      x: (d.x - xExtent[0]) * scaleFactor,
      y: (d.y - yExtent[0]) * scaleFactor
    }));

    // 定义箭头标记
    const arrow = svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 3)
      .attr('refY', 0)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto-start-reverse') // 确保箭头方向正确
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'steelblue')
      .attr('stroke', 'none');

    // 添加路径
    const path = svg.append('path')
      .datum(scaledData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 10)
      .attr('d', line)
      .attr('marker-end', 'url(#arrowhead)');

    // 计算路径的总长度
    const totalLength = path.node().getTotalLength();
    // 应用路径动画
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // 计算路径的边界框
    const bbox = path.node().getBBox();

    // 计算中心点和偏移量
    const bboxCenterX = bbox.x + bbox.width / 2;
    const bboxCenterY = bbox.y + bbox.height / 2;
    const translateX = centerX - bboxCenterX;
    const translateY = centerY - bboxCenterY;

    // 应用偏移
    path.attr('transform', `translate(${translateX}, ${translateY})`);

    // 创建圆润的起点
    const startPoint = scaledData[0];
    svg.append('circle')
      .attr('cx', startPoint.x + translateX)
      .attr('cy', startPoint.y + translateY)
      .attr('r', 5)
      .attr('fill', 'steelblue');

    // 添加跟随路径移动的箭头
    const movingArrow = svg.append('path')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 3)
      .attr('refY', 0)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'red')
      .attr('stroke', 'none');

    // 更新箭头位置的函数
    const updateArrowPosition = (t) => {
      const point = path.node().getPointAtLength(t * totalLength);
      const previousPoint = path.node().getPointAtLength((t * totalLength) - 1);
      const angle = Math.atan2(point.y - previousPoint.y, point.x - previousPoint.x) * 180 / Math.PI;
      movingArrow.attr('transform', `translate(${point.x + translateX}, ${point.y + translateY}) rotate(${angle})`);
    };

    // 箭头移动动画
    d3.transition()
      .duration(500)
      .ease(d3.easeLinear)
      .tween('pathTween', () => {
        return (t) => {
          updateArrowPosition(t);
        };
      });

  }, [props]);


  return <svg ref={svgRef}></svg>;
}