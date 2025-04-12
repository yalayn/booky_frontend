declare module 'react-native-chart-kit' {
    import React from 'react';
    import { ViewStyle } from 'react-native';
  
    export interface ChartConfig {
      backgroundColor: string;
      backgroundGradientFrom: string;
      backgroundGradientTo: string;
      decimalPlaces?: number;
      color: (opacity?: number) => string;
      labelColor: (opacity?: number) => string;
      style?: ViewStyle;
      propsForDots?: object;
    }
  
    export interface LineChartProps {
      data: {
        labels: string[];
        datasets: { data: number[] }[];
      };
      width: number;
      height: number;
      chartConfig: ChartConfig;
      bezier?: boolean;
      style?: ViewStyle;
    }
  
    export class LineChart extends React.Component<LineChartProps> {}
  }