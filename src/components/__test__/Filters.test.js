// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import Filters from '../Filters';

const setPhrase = jest.fn();
const setAuthor = jest.fn();

describe('Component: Filters snapshot', () => {
    it('should render Filters ', () => {
        const wrapper = shallow(<Filters authorImages={new Map()} authors={["some","random", "authors"]} language="en" setPhrase={() => {}} setAuthor={() => {}} />);

        expect(wrapper).toMatchSnapshot();
    });
});

describe('Filters component', () => {
    const wrapper = shallow(
      <Filters
        authorImages={new Map()}
        authors={["some","random", "authors"]}
        language="en"
        setPhrase={setPhrase}
        setAuthor={setAuthor}
      />
    );

    const language = wrapper.find("[name='language']");
    const phraseInput = wrapper.find("input");
    const button = wrapper.find("button");

    test('it renders filters language', () => {
        expect(language.exists()).toBeTruthy();
    });

    test('it renders phraseInput language and call setPhrase', () => {
        expect(phraseInput.exists()).toBeTruthy();
        phraseInput.simulate('change');
        expect(setPhrase).toBeCalled();
    });

    test('it renders allAuthors button and call setAuthor', () => {
        expect(button.exists()).toBeTruthy();
        button.simulate('click');
        expect(setAuthor).toBeCalled();
    });
});
