import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
const PackedBubbleChart = ({ dataFromServer }) => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [layoutData, setLayoutData] = useState(null);

  const width = 600;
  const height = 600;
  const margin = 10;

  useEffect(() => {
    if (!dataFromServer || dataFromServer.length === 0) {
      setLayoutData(null);
      return;
    }
    const validData = dataFromServer.filter(
      (d) =>
        d &&
        typeof d.name !== "undefined" &&
        typeof d.value === "number" &&
        d.value > 0
    );
    if (validData.length === 0) {
      setLayoutData(null);
      return;
    }
    const root = d3
      .hierarchy({ children: validData })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    const packLayout = d3
      .pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(5);
    const packedRoot = packLayout(root);
    setLayoutData(packedRoot.leaves());
  }, [dataFromServer, width, height, margin]);

  useEffect(() => {
    if (!layoutData || !svgRef.current) {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    const categories = Array.from(
      new Set(layoutData.map((d) => d.data.category))
    );
    const color = d3
      .scaleOrdinal()
      .domain(
        categories.length > 0 ? categories : layoutData.map((d) => d.data.name)
      )
      .range(d3.schemeTableau10);

    const tooltip = chartGroup
      .append("text")
      .attr("class", "bubble-tooltip")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("pointer-events", "none")
      .attr("text-anchor", "middle");

    // 각 버블(노드)을 나타내는 'g' 요소 생성
    const node = chartGroup
      .selectAll("g.node")
      .data(layoutData)
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer") // 클릭 가능함을 나타내는 커서 모양
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#333")
          .attr("stroke-width", 2);
        tooltip
          .style("opacity", 1)
          .attr("transform", `translate(${d.x},${d.y - d.r - 5})`)
          .text(`${d.data.name}: ${d.data.value}`)
          .raise();
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke", null)
          .attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      })
      // --- 클릭 이벤트 핸들러 추가 ---
      .on("click", function (event, d) {
        // event: DOM 이벤트 객체
        // d: 클릭된 노드에 바인딩된 데이터 (D3에서 계산된 x, y, r 값과 원본 데이터 d.data 포함)
        console.log("버블 클릭됨:", d.data); // 원본 데이터 객체 출력
        console.log("버블 이름:", d.data.name);
        console.log("버블 값:", d.data.value);
        console.log("계산된 위치 및 크기 (x, y, r):", {
          x: d.x,
          y: d.y,
          r: d.r,
        });

        navigate("/about");
      });
    // --- 클릭 이벤트 핸들러 추가 끝 ---

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => color(d.data.category || d.data.name))
      .attr("opacity", 0.85)
      .attr("stroke", (d) =>
        d3.rgb(color(d.data.category || d.data.name)).darker(0.5)
      )
      .attr("stroke-width", 1);

    const textNodes = node
      .append("text")
      .attr("class", "bubble-text")
      .attr("clip-path", (d) => `circle(${d.r * 0.9})`)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("pointer-events", "none")
      .style("font-weight", "bold");

    textNodes.each(function (d) {
      if (!d.data || typeof d.data.name === "undefined" || d.r < 8) {
        return;
      }
      const self = d3.select(this);
      const textContent = String(d.data.name);
      const radius = d.r;
      let lines = [textContent];
      const maxCharsPerLine = Math.floor((radius * 1.8) / 8);
      if (textContent.length > maxCharsPerLine) {
        if (
          textContent.includes(" ") &&
          textContent.length > maxCharsPerLine * 0.7
        ) {
          const firstSpaceIndex = textContent.indexOf(" ");
          if (firstSpaceIndex > 0 && firstSpaceIndex < maxCharsPerLine * 1.2) {
            lines = [
              textContent.substring(0, firstSpaceIndex),
              textContent.substring(firstSpaceIndex + 1),
            ];
            if (lines[1].length > maxCharsPerLine * 0.8)
              lines[1] =
                lines[1].substring(0, Math.floor(maxCharsPerLine * 0.8)) + "..";
            if (lines[0].length > maxCharsPerLine)
              lines[0] = lines[0].substring(0, maxCharsPerLine) + "..";
          } else {
            lines = [textContent.substring(0, maxCharsPerLine - 2) + "..."];
          }
        } else {
          lines = [textContent.substring(0, maxCharsPerLine - 2) + "..."];
        }
      }
      if (lines.length > 2) lines = lines.slice(0, 2);
      const fontSize =
        Math.max(
          6,
          Math.min(
            radius / (lines.length || 1) / 1.5,
            (radius * 1.8) / (textContent.length / (lines.length || 1))
          )
        ) + "px";
      self.style("font-size", fontSize);
      lines.forEach((line, i) => {
        self
          .append("tspan")
          .attr("x", 0)
          .attr("y", `${i - (lines.length - 1) * 0.5 + 0.05}em`)
          .text(line);
      });
    });
  }, [layoutData, width, height, margin]);

  if (
    !dataFromServer ||
    dataFromServer.filter(
      (d) =>
        d &&
        typeof d.name !== "undefined" &&
        typeof d.value === "number" &&
        d.value > 0
    ).length === 0
  ) {
    return (
      <p
        style={{
          textAlign: "center",
          width: `${width}px`,
          height: `${height}px`,
          lineHeight: `${height}px`,
        }}
      >
        표시할 데이터가 없사옵니다.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

// App 컴포넌트 (예시용)
const App = () => {
  const sampleData = [
    { name: "리액트", value: 120, category: "Frontend" },
    { name: "D3.js", value: 90, category: "Visualization" },
    { name: "Node.js", value: 110, category: "Backend" },
    { name: "Svelte", value: 50, category: "Frontend" },
    { name: "데이터베이스", value: 80, category: "Backend" },
    { name: "CSS", value: 70, category: "Frontend" },
    { name: "Python", value: 150, category: "Backend" },
    { name: "SVG", value: 40, category: "Visualization" },
    { name: "JavaScript", value: 200, category: "Language" },
    { name: "TypeScript", value: 130, category: "Language" },
  ];

  return (
    <div>
      <h1>실시간 검색어 트렌드 - 클릭해서 검색해보세요</h1>
      <PackedBubbleChart dataFromServer={sampleData} />
    </div>
  );
};

export default App;
