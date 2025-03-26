import { Tabs, TabsProps } from 'antd';
import { MirrorForm } from './Components/Tabs/MirrorForm/MirrorForm';
import { MirrorTable } from './Components/Tabs/MirrorTable/MirrorTable';
import { useState } from 'react';

export const App = () => {
  const [countOfTableUpdates, setCountOfTableUpdates] = useState(1);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Добавление зеркала',
      children: <MirrorForm 
                  setIsUpdated={setCountOfTableUpdates.bind(null, prev => prev + 1)}
                />,
    },
    {
      key: '2',
      label: 'Таблица зеркал',
      children: <MirrorTable
                  key={countOfTableUpdates}
                />,
    }
  ];
  return (
    <Tabs
      items={items}
    />
  )
}
