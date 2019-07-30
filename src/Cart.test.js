// @flow strict

import * as React from "react";
import "@testing-library/jest-dom/extend-expect";

// В самом пакете нет функций-селекторов getAllByText, getByLabelText, findAllByText, queryByText
// Вот что есть в самой библиотеке https://github.com/testing-library/react-testing-library/blob/929748f092013b4045f65866edea5df9680f1f3a/src/index.js#L147
// И кое-что наследуется из dom-testing-library: https://github.com/testing-library/dom-testing-library/blob/d719edd658ce6ad616f2632f378b3a7f4bf03897/src/index.js#L2
//
// Функции селекторы есть только после вызова `render`
import { render, fireEvent, cleanup, within, getAllByText, getByLabelText, findAllByText, queryByText } from "@testing-library/react";

import Shop from "./Shop";
import Cart from "./Cart";

afterEach(cleanup);

// Видно сколько товаров в корзине не открывая её
test("Добавление одного товара в корзину увеличивает количество предметов в корзине до одного", async () => {

  const { getByText, getByTestId } = render(<Shop />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;

  const addToCartButton = within(itemNode).getByText("В корзину");

  fireEvent.click(addToCartButton);

  expect(getByTestId("open-cart-button")).toHaveTextContent("(1)");

});

test("Добавление двух товаров в корзину увеличивает количество предметов до двух", async () => {

  const { getByText, getByTestId } = render(<Shop />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;

  const addToCartButton = within(itemNode).getByText("В корзину");

  fireEvent.click(addToCartButton);
  fireEvent.click(addToCartButton);

  expect(getByTestId("open-cart-button")).toHaveTextContent("(2)");

});

test("Добавление трех товаров в корзину увеличивает количество предметов до трех", async () => {

  const { getByText, getByTestId } = render(<Shop />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;

  const addToCartButton = within(itemNode).getByText("В корзину");

  fireEvent.click(addToCartButton);
  fireEvent.click(addToCartButton);
  fireEvent.click(addToCartButton);

  expect(getByTestId("open-cart-button")).toHaveTextContent("(3)");

});

test("Открытие пустой корзины", async () => {

  const { getByText, getByTestId } = render(<Shop />);

  const itemNode = getByText("Ле Носкишоп Муа").parentNode;

  const openCartButton = within(itemNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(openCartButton);
  fireEvent.click(openCartButton);

  expect(getByTestId("open-cart-button")).toHaveTextContent("(0)");

});

// Расчет стоимости
test("Расчет стоимости одного товара в корзине", async () => {

  const { getByTestId, getByText} = render(<Shop />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;

  const addToCartButton = within(itemNode).getByText("В корзину");

  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(addToCartButton);
  fireEvent.click(openCartButton); 

  expect(getByTestId("open-cart-button")).toHaveTextContent("(1)");
  expect(getByTestId("totalPrice")).toHaveTextContent('200₽');
});

test("Расчет стоимости двух одинаковых товаров в корзине", async () => {

  const { getByTestId, getByText} = render(<Shop />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;

  const addToCartButton = within(itemNode).getByText("В корзину");

  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(addToCartButton);
  fireEvent.click(addToCartButton);
  fireEvent.click(openCartButton); 

  expect(getByTestId("open-cart-button")).toHaveTextContent("(2)");
  expect(getByTestId("totalPrice")).toHaveTextContent('400₽');

});

test("Расчет стоимости трех разных товаров в корзине", async () => {

  const { getByTestId, getByText} = render(<Shop />);

  const firstItemNode = getByText("Ле Кис-Кис").parentNode;
  const secondItemNode = getByText("Ле Братец лис").parentNode;
  const thirdItemNode = getByText("Ле Хохлома").parentNode;

  const firstItemButton = within(firstItemNode).getByText("В корзину");
  const secondItemButton = within(secondItemNode).getByText("В корзину");
  const thirdItemButton = within(thirdItemNode).getByText("В корзину");

  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(firstItemButton);
  fireEvent.click(secondItemButton);
  fireEvent.click(thirdItemButton); 
  fireEvent.click(openCartButton); 

  expect(getByTestId("open-cart-button")).toHaveTextContent("(3)");
  expect(getByTestId("totalPrice")).toHaveTextContent('600₽');
  
});

test("Расчет стоимости трех разных товаров и доставки в корзине", async () => {

  // в функцию передано два реакт-элемента, но он принимает только один
  // Второй аргумент может быть только объектом с настройками:
  // https://testing-library.com/docs/react-testing-library/api#render
  //
  // Тут не надо в тесте передавать <Cart />, потому что он уже содержится
  // внутри <Shop />
  const { getByTestId, getByText} = render(<Shop />, <Cart />);

  const firstItemNode = getByText("Ле Кис-Кис").parentNode;
  const secondItemNode = getByText("Ле Братец лис").parentNode;
  const thirdItemNode = getByText("Ле Хохлома").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;
  

  const firstItemButton = within(firstItemNode).getByText("В корзину");
  const secondItemButton = within(secondItemNode).getByText("В корзину");
  const thirdItemButton = within(thirdItemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(firstItemButton);
  fireEvent.click(secondItemButton);
  fireEvent.click(thirdItemButton); 
  fireEvent.click(openCartButton); 

  const deliveryButton = getByText("Нужна доставка");

  fireEvent.click(deliveryButton); 

  expect(getByTestId("open-cart-button")).toHaveTextContent("(3)");
  expect(getByTestId("totalPrice")).toHaveTextContent('1100₽');
  
});

test("Промо-акция: 11 товаров + доставка", async () => {

  const { getByTestId, getByText} = render(<Shop />, <Cart />);

  const itemNode = getByText("Ле Жгучий перец").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const itemButton = within(itemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  for (let i = 1; i < 12; i++) {
    fireEvent.click(itemButton);
  }

  fireEvent.click(openCartButton);

  const deliveryButton = getByText("Нужна доставка");

  fireEvent.click(deliveryButton); 

  expect(getByTestId("open-cart-button")).toHaveTextContent("(11)");
  expect(getByTestId("totalPrice")).toHaveTextContent('5500₽');
  
});

// Товары в корзине
test("Добавляем один товар", async () => {

  const { getByTestId, getByText } = render(<Shop />, <Cart />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const itemButton = within(itemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(itemButton);
  fireEvent.click(openCartButton);

  const cart = getByText("Ваш заказ").parentNode;

  const cartFirstItem = within(cart).getByText("Ле Кис-Кис").parentNode;
  
  expect(cartFirstItem).toHaveTextContent(/(Ле Кис-Кис)(200₽)(1 шт)/);
  
});

test("Две единицы одного товара", async () => {

  const { getByTestId, getByText } = render(<Shop />, <Cart />);

  const itemNode = getByText("Ле Кис-Кис").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const itemButton = within(itemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(itemButton);
  fireEvent.click(itemButton);
  fireEvent.click(openCartButton);

  const cart = getByText("Ваш заказ").parentNode;

  const cartFirstItem = within(cart).getByText("Ле Кис-Кис").parentNode;
  
  expect(cartFirstItem).toHaveTextContent(/(Ле Кис-Кис)(200₽)(2 шт)/);

});

test("Два разных товара", async () => {

  const { getByTestId, getByText } = render(<Shop />, <Cart />);

  const firstItemNode = getByText("Ле Кис-Кис").parentNode;
  const secondItemNode = getByText("Ле Хохлома").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const firstItemButton = within(firstItemNode).getByText("В корзину");
  const secondItemButton = within(secondItemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(firstItemButton);
  fireEvent.click(secondItemButton);
  fireEvent.click(openCartButton);

  const cart = getByText("Ваш заказ").parentNode;

  const cartFirstItem = within(cart).getByText("Ле Кис-Кис").parentNode;
  const cartSecondItem = within(cart).getByText("Ле Хохлома").parentNode;
  
  expect(cartFirstItem).toHaveTextContent(/(Ле Кис-Кис)(200₽)(1 шт)/);
  expect(cartSecondItem).toHaveTextContent(/(Ле Хохлома)(300₽)(1 шт)/);

});

test("Три товара, два одинаковых", async () => {

  const { getByTestId, getByText } = render(<Shop />, <Cart />);

  const firstItemNode = getByText("Ле Кис-Кис").parentNode;
  const secondItemNode = getByText("Ле Хохлома").parentNode;
  const cartButtonNode = getByText("Ле Носкишоп Муа").parentNode;

  const firstItemButton = within(firstItemNode).getByText("В корзину");
  const secondItemButton = within(secondItemNode).getByText("В корзину");
  const openCartButton = within(cartButtonNode).getByText("Ле Корзинуа", {exact:false});

  fireEvent.click(firstItemButton);
  fireEvent.click(secondItemButton);
  fireEvent.click(secondItemButton);
  fireEvent.click(openCartButton);

  const cart = getByText("Ваш заказ").parentNode;

  const cartFirstItem = within(cart).getByText("Ле Кис-Кис").parentNode;
  const cartSecondItem = within(cart).getByText("Ле Хохлома").parentNode;
  
  expect(cartFirstItem).toHaveTextContent(/(Ле Кис-Кис)(200₽)(1 шт)/);
  expect(cartSecondItem).toHaveTextContent(/(Ле Хохлома)(300₽)(2 шт)/);
  
});



