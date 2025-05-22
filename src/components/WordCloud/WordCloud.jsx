import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setKeyword } from "../../redux/keyword/keywordSlice";
const PackedBubbleChart = ({ dataFromServer }) => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const containerRef = useRef(null); // SVG를 감싸고 크기를 측정할 컨테이너 div의 ref
  const [layoutData, setLayoutData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // 동적 크기를 저장할 state
  const margin = 10;
  const dispatch = useDispatch();

  // 컨테이너 div의 크기 변경을 감지하는 useEffect
  useEffect(() => {
    const currentContainer = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries && entries.length > 0 && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !dataFromServer ||
      dataFromServer.length === 0 ||
      dimensions.width === 0 ||
      dimensions.height === 0
    ) {
      setLayoutData(null);
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove(); // SVG 내용 클리어
      }
      return;
    }

    const validData = dataFromServer.filter(
      (d) =>
        d &&
        typeof d.keyword !== "undefined" &&
        typeof d.count === "number" &&
        d.count > 0
    );

    if (validData.length === 0) {
      setLayoutData(null);
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove(); // SVG 내용 클리어
      }
      return;
    }

    const root = d3
      .hierarchy({ children: validData })
      .sum((d) => d.count)
      .sort((a, b) => b.count - a.count);

    // 동적으로 받아온 dimensions를 사용
    const packLayout = d3
      .pack()
      .size([dimensions.width - margin * 2, dimensions.height - margin * 2])
      .padding(5);

    const packedRoot = packLayout(root);
    setLayoutData(packedRoot.leaves());
  }, [dataFromServer, dimensions, margin]); // dataFromServer나 dimensions가 변경될 때 재실행

  // D3 버블 차트 렌더링을 위한 useEffect
  useEffect(() => {
    if (
      !layoutData ||
      !svgRef.current ||
      dimensions.width === 0 ||
      dimensions.height === 0
    ) {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 이전 렌더링 내용 제거

    // SVG 크기를 동적 dimensions에 맞게 설정
    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    const categories = Array.from(
      new Set(layoutData.map((d) => d.data.category))
    );
    const color = d3
      .scaleOrdinal()
      .domain(
        categories.length > 0
          ? categories
          : layoutData.map((d) => d.data.keyword)
      )
      .range(d3.schemeTableau10);

    const tooltip = chartGroup
      .append("text")
      // ... (툴팁 나머지 설정은 기존과 동일)
      .attr("class", "bubble-tooltip")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .style("pointer-events", "none")
      .attr("text-anchor", "middle");

    const node = chartGroup
      .selectAll("g.node")
      .data(layoutData)
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#333")
          .attr("stroke-width", 2);
        tooltip
          .style("opacity", 1)
          .attr("transform", `translate(${d.x},${d.y - d.r - 5})`)
          .text(`${d.data.keyword}는 ${d.data.count}번 검색 됐습니다`)
          .raise();
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke", null)
          .attr("stroke-width", 1); // 기존 stroke-width로 복원하거나, 아래 circle 설정에 맞게 조정
        tooltip.style("opacity", 0);
      })
      .on("click", function (event, d) {
        const keyword = d.data.keyword;
        dispatch(setKeyword(keyword));
        navigate(`/view-news/${keyword}`);
      });

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => color(d.data.keyword))
      .attr("opacity", 0.85)
      .attr("stroke", (d) => d3.rgb(color(d.data.keyword)).darker(0.5))
      .attr("stroke-width", 1);

    const textNodes = node
      .append("text")
      // ... (텍스트 노드 나머지 설정은 기존과 동일하나, d.r 값이 동적 크기에 따라 변하므로 텍스트 크기/줄바꿈 로직이 영향을 받을 수 있음을 인지하셔야 합니다)
      .attr("class", "bubble-text")
      .attr("clip-path", (d) => `circle(${d.r * 0.9})`) // 원형 클리핑 경로
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("pointer-events", "none") // 텍스트는 마우스 이벤트 방해하지 않도록
      .style("font-weight", "bold");

    textNodes.each(function (d) {
      if (!d.data || typeof d.data.keyword === "undefined" || d.r < 8) {
        // 작은 버블은 텍스트 표시 안 함
        return;
      }
      const self = d3.select(this);
      const textContent = String(d.data.keyword);
      const radius = d.r; // 현재 버블의 반지름

      // 텍스트 줄바꿈 및 크기 조절 로직 (기존 로직 유지, 필요시 d.r에 따라 동적으로 반응하도록 미세 조정 가능)
      let lines = [textContent];
      const maxCharsPerLine = Math.floor((radius * 1.8) / 8); // 글자 크기 8px 기준 한 줄 최대 글자 수 (대략적)

      if (textContent.length > maxCharsPerLine) {
        // 공백 기준으로 줄바꿈 시도
        if (
          textContent.includes(" ") &&
          textContent.length > maxCharsPerLine * 0.7
        ) {
          const firstSpaceIndex = textContent.indexOf(" ");
          if (firstSpaceIndex > 0 && firstSpaceIndex < maxCharsPerLine * 1.2) {
            // 적절한 위치의 공백
            lines = [
              textContent.substring(0, firstSpaceIndex),
              textContent.substring(firstSpaceIndex + 1),
            ];
            // 두 번째 줄이 너무 길면 자르기
            if (lines[1].length > maxCharsPerLine * 0.8)
              lines[1] =
                lines[1].substring(0, Math.floor(maxCharsPerLine * 0.8)) + "..";
            // 첫 번째 줄도 너무 길면 자르기 (드문 경우)
            if (lines[0].length > maxCharsPerLine)
              lines[0] = lines[0].substring(0, maxCharsPerLine) + "..";
          } else {
            lines = [textContent.substring(0, maxCharsPerLine - 2) + "..."]; // 공백이 없거나 부적절하면 그냥 자르기
          }
        } else {
          lines = [textContent.substring(0, maxCharsPerLine - 2) + "..."]; // 짧은 단어인데 길면 자르기
        }
      }
      if (lines.length > 2) lines = lines.slice(0, 2); // 최대 2줄

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
          .attr("y", `${i - (lines.length - 1) * 0.5 + 0.05}em`) // 중앙 정렬 (em 단위로 조정)
          .text(line);
      });
    });
  }, [layoutData, dimensions, margin, navigate]); // layoutData나 dimensions 변경 시 재렌더링

  // 표시할 유효 데이터가 있는지 확인
  const hasValidData =
    dataFromServer &&
    dataFromServer.filter(
      (d) =>
        d &&
        typeof d.keyword !== "undefined" &&
        typeof d.count === "number" &&
        d.count > 0
    ).length > 0;

  return (
    <div
      ref={containerRef} // 이 div의 크기를 측정
      style={{
        width: "100%", // 부모 요소가 제공하는 너비를 모두 사용
        height: "100%", // 부모 요소가 제공하는 높이를 모두 사용
        display: "flex", // 내부 요소(SVG 또는 메시지)를 중앙 정렬하기 위함
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column", // "데이터 없음" 메시지 등을 위함
        overflow: "hidden", // 버블이 컨테이너를 벗어나지 않도록
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? ( // 크기가 측정된 후에만 내용 표시
        hasValidData ? (
          <svg ref={svgRef} /> // SVG 크기는 effect에서 설정됨
        ) : (
          <p style={{ textAlign: "center" }}>표시할 데이터가 없습니다.</p>
        )
      ) : (
        // 크기 측정 중이거나 초기 상태일 때 표시할 내용 (선택 사항)
        <p>차트 크기를 계산 중...</p>
      )}
    </div>
  );
};

export default PackedBubbleChart; // 또는 export default PackedBubbleChart; 실제 사용에 맞게 수정
