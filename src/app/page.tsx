'use client';
import { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

interface NodeData {
  id: number | string;
  label: string;
}

interface EdgeData {
  from: number | string;
  to: number | string;
}

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export default function Home() {
  const [tema, setTema] = useState<string>("");
  const [data, setData] = useState<GraphData>({ nodes: [], edges: [] });

  const networkRef = useRef<HTMLDivElement | null>(null);
  const networkInstance = useRef<Network | null>(null);

  useEffect(() => {
    if (networkRef.current && data.nodes.length && data.edges.length) {
      const nodes = new DataSet(data.nodes);
      const edges = new DataSet(data.edges);

      const options = {
        layout: {
          hierarchical: {
            direction: "LR",
            levelSeparation: 200,
            nodeSpacing: 150,
            sortMethod: "directed"
          }
        },
        edges: {
          smooth: true,
          arrows: { to: { enabled: true, scaleFactor: 1 } },
          color: "#ccc"
        },
        nodes: {
          borderWidth: 2,
          shape: "box",
          margin: { top: 12, right: 12, bottom: 12, left: 12 }
        },
        physics: false
      };

      networkInstance.current = new Network(networkRef.current, { nodes, edges }, options);
    }
  }, [data]);

  const handleGetJSON = async () => {
    const response = await fetch("http://127.0.0.1:7000/tema", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tema }),
    });
    const json: GraphData = await response.json();
    setData(json);
  };

  return (
    <div className="flex flex-col gap-12 items-center justify-items-center min-h-screen p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <input type="button" value="Enviar" className="border" onClick={handleGetJSON} />

      <input type="text" className="border" value={tema} onChange={(e) => setTema(e.target.value)} />
      <div id="mynetwork" ref={networkRef} style={{ width: "100%", height: "600px", border: "1px solid lightgray" }}></div>
    </div>
  );
}
