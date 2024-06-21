import CurveRouterV13Abi from "./abis/curverouterv13.abi.json";
import YodlRouterV01 from "./abis/YodlRouterV0.1.abi.json";
import YodlRouterV02 from "./abis/YodlRouterV0.2.abi.json";
import YodlRouterV03 from "./abis/YodlRouterV0.3.abi.json";

export const HIRO_ROUTER_ABIS: { [key: string]: any} = {
  "0.1": YodlRouterV01,
  "0.2": YodlRouterV02,
  "0.3": YodlRouterV03,
  "test": YodlRouterV03
}
export const CURVE_ROUTER_ABI = CurveRouterV13Abi;
