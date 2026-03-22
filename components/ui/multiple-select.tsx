'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
}: MultipleSelectProps) => {
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
    onChange?.(selected);
  }, [selected, onChange]);

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i.key !== item.key));
  };

  return (
    <AnimatePresence mode={'popLayout'}>
      <div className={'flex w-full flex-col gap-3'}>
        <motion.div
          layout
          ref={containerRef}
          className='selected no-scrollbar flex min-h-[56px] w-full items-center overflow-x-auto scroll-smooth rounded-2xl border border-solid border-gray-200 bg-gray-50/50 p-2 shadow-inner'
        >
          {selected.length === 0 && (
            <span className="text-sm text-gray-400 italic px-2">No ingredients selected yet...</span>
          )}
          <motion.div layout className='flex items-center gap-2'>
            {selected?.map((item) => (
              <Tag
                name={item?.key}
                key={item?.key}
                className={'bg-white shadow text-gray-900 border border-gray-200'}
              >
                <div className='flex items-center gap-1.5'>
                  <motion.span layout className={'whitespace-nowrap font-medium text-xs'}>
                    {item?.name}
                  </motion.span>
                  <button className={'text-gray-400 hover:text-red-500 transition-colors ml-1'} onClick={() => onDeselect(item)}>
                    <X size={14} />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>
        
        {tags?.length > selected?.length && (
          <div className='flex w-full flex-wrap gap-2'>
            {tags
              ?.filter((item) => !selected?.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  name={item?.key}
                  onClick={() => onSelect(item)}
                  key={item?.key}
                  className="bg-white hover:bg-orange-50 border border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-sm"
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span layout className={'whitespace-nowrap text-xs font-medium'}>
                      {item?.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, 'onClick'> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={
        `cursor-pointer rounded-xl px-3 py-1.5 flex items-center justify-center ${className}`
      }
    >
      {children}
    </motion.div>
  );
};
