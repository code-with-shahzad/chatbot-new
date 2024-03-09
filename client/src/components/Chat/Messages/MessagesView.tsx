import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
// import type { TMessage } from 'librechat-data-provider';
import ScrollToBottom from '~/components/Messages/ScrollToBottom';
import { useScreenshot, useMessageScrolling } from '~/hooks';
import { CSSTransition } from 'react-transition-group';
import MultiMessage from './MultiMessage';
import MessageContent from './Content/MessageContent';
import { cn } from '~/utils';
import { TypeAnimation } from 'react-type-animation';

export default function MessagesView({
  messagesTree: _messagesTree,
  Header,
}: {
  // messagesTree?: TMessage[] | null;
  messagesTree?: [{ sentByUser: boolean; text: string }];
  Header?: ReactNode;
}) {
  const { screenshotTargetRef } = useScreenshot();
  const [currentEditId, setCurrentEditId] = useState<number | string | null>(-1);

  const {
    conversation,
    scrollableRef,
    messagesEndRef,
    showScrollButton,
    handleSmoothToRef,
    debouncedHandleScroll,
  } = useMessageScrolling(_messagesTree);
  const { conversationId } = conversation ?? {};

  return (
    <div className="flex-1 overflow-hidden overflow-y-auto">
      <div className="dark:gpt-dark-gray relative h-full">
        <div
          onScroll={debouncedHandleScroll}
          ref={scrollableRef}
          style={{
            height: '100%',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <div className="flex flex-col pb-9 text-sm dark:bg-transparent">
            {(_messagesTree && !_messagesTree?.length) || _messagesTree === null ? (
              <div className="flex w-full items-center justify-center gap-1 bg-gray-50 p-3 text-sm text-gray-500 dark:border-gray-800/50 dark:bg-gray-800 dark:text-gray-300">
                Nothing found
              </div>
            ) : (
              <>
                {Header && Header}
                {/* <div ref={screenshotTargetRef}>
                  <MultiMessage
                    key={conversationId} // avoid internal state mixture
                    messagesTree={_messagesTree}
                    messageId={conversationId ?? null}
                    setCurrentEditId={setCurrentEditId}
                    currentEditId={currentEditId ?? null}
                  />
                </div> */}
                <div ref={screenshotTargetRef}>
                  <>
                    {_messagesTree?.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          className="text-token-text-primary w-full border-0 bg-transparent dark:border-0 dark:bg-transparent"
                        >
                          <div className="m-auto justify-center p-4 py-2 text-base md:gap-6 ">
                            <div className="} group mx-auto flex flex-1 gap-3 text-base md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
                              <div className="relative flex flex-shrink-0 flex-col items-end">
                                <div>
                                  <div className="pt-0.5">
                                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                                      <img
                                        src={
                                          item?.sentByUser
                                            ? '../../../../public/assets/usericon.png'
                                            : '../../../../public/assets/chatgpticon.webp'
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={cn(
                                  'relative flex w-full flex-col',
                                  item?.sentByUser ? '' : 'agent-turn',
                                )}
                              >
                                <div className="select-none font-semibold">
                                  {item?.sentByUser ? 'You' : 'Chatbot'}
                                </div>
                                <div className="flex-col gap-1 md:gap-3">
                                  <div className="flex max-w-full flex-grow flex-col gap-0">
                                    {!item?.sentByUser && idx == _messagesTree?.length-1 ? (
                                      <TypeAnimation
                                        splitter={(str) => str.split(/(?= )/)}
                                        sequence={[item?.text, 3000, item?.text]}
                                        speed={{ type: 'keyStrokeDelayInMs', value: 30 }}
                                        repeat={0}
                                        cursor={false}
                                      />
                                    ) : (
                                      item?.text
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                </div>
              </>
            )}
            <div
              className="dark:gpt-dark-gray group h-0 w-full flex-shrink-0 dark:border-gray-800/50"
              ref={messagesEndRef}
            />
          </div>
        </div>
        <CSSTransition
          in={showScrollButton}
          timeout={400}
          classNames="scroll-down"
          unmountOnExit={false}
          // appear
        >
          {() => showScrollButton && <ScrollToBottom scrollHandler={handleSmoothToRef} />}
        </CSSTransition>
      </div>
    </div>
  );
}
