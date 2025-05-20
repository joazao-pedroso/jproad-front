'use client';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(false);

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
        color: {
          background: "#facc15",
          border: "#eab308",
          highlight: {
            background: "#fde047",
            border: "#facc15"
          }
        },
        font: {
          color: "#000",
          size: 16,
          face: "Arial"
        },
        margin: { top: 12, right: 12, bottom: 12, left: 12 }
      },
      physics: false
    };

    const network = new Network(networkRef.current, { nodes, edges }, options);
    networkInstance.current = network;

    // Adiciona o event listener
      network.on("doubleClick", function (params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.get(nodeId);
          handleGetJSON(`${tema} > ${node.label}`);
          setTema(`${tema} > ${node.label}`);
        }
      });
  }
}, [data, tema]);


const handleGetJSON = async (newTema: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://jproad-backend.vercel.app/tema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tema: newTema }),
      });
      const json: GraphData = await response.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao buscar o mapa:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      
      <header className="w-full bg-yellow-500/10 border border-yellow-500 rounded-xl shadow-md p-6 max-w-6xl mx-auto mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">

            <div>
              <h1 className="text-2xl font-bold text-yellow-100">JProad</h1>
              <p className="text-sm text-yellow-200">Mapas de aprendizado personalizados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center gap-10 p-6 sm:p-12 max-w-6xl mx-auto w-full">

        <h2  className="text-4xl font-bold text-gray-200 text-center mt-6">Crie seu caminho de aprendizado</h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          <Input 
            type="text"
            className="flex-1 bg-zinc-800 text-white border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
            placeholder="Digite o tema desejado..."
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />
   <Button 
            onClick={() => handleGetJSON(tema)}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Gerando...
              </>
            ) : (
              "Gerar Mapa"
            )}
          </Button>
        </div>

        {/* Grafo */}
        <div 
          id="mynetwork"
          ref={networkRef}
          className="w-full border border-zinc-700 rounded-lg shadow-inner bg-zinc-900"
          style={{ height: "600px" }}
        >

        </div>
      </main>

      {/* Rodapé opcional */}
      <footer className="text-center text-sm text-zinc-500 mt-8 pb-6">
        © {new Date().getFullYear()} JProad. Todos os direitos reservados.
      </footer>
    </div>
  );
}
