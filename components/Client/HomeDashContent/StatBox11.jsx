import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

// Sample data for the PieChart
const data = [
  { name: 'Sensors - Active', value: 50 },
  { name: 'Sensors - Inactive', value: 10 },
  { name: 'Devices - Active', value: 30 },
  { name: 'Devices - Inactive', value: 15 },
];

// Custom active shape for the PieChart
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#04D5C7">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#04D5C7">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const StatBox11 = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className='StatBoxContainer5 rounded-lg shadow-md'>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={60}
            fill="#04D5C7"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatBox11;
